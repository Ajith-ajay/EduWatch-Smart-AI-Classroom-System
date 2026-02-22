import time
import cv2
import threading
from queue import Queue

from config import CAMERA_INDEX, WINDOW_NAME

from person_detector import detect_person
from pose_detector import detect_gesture
from voice_detector import VoiceDetector
from decision_engine import decide
from recognizer import TeacherRecognizer

# Frame skipping parameters
PROCESS_EVERY_N_FRAMES = 3  # Process every 3rd frame
# FRAME_SIZE = (640, 480)  # Reduce resolution for faster processing
FRAME_SIZE = (1280, 720)


# Shared variables between threads
detection_lock = threading.Lock()
latest_detections = {
    'teacher_detected': False,
    'teacher_name': None,
    'person_detected': False,
    'gesture_detected': False,
    'status': 'Initializing...',
    'color': (255, 255, 255)
}

def detection_worker(frame_queue, recognizer, voice_detector):
    """Background thread for heavy ML operations"""
    while True:
        frame = frame_queue.get()
        if frame is None:  # Signal to stop
            break
        
        # Detect teacher (only if we have detections running)
        teacher_detected, teacher_name, _ = recognizer.recognize(frame)
        
        # Detect person
        person, _ = detect_person(frame)
        
        # Detect gesture
        gesture, _ = detect_gesture(frame)

        voice = voice_detector.detect_voice()  # Optional voice detection
        
        # Decision engine
        status, color = decide(teacher_detected, person, gesture, voice)
        
        # Update shared detections safely
        with detection_lock:
            latest_detections['teacher_detected'] = teacher_detected
            latest_detections['teacher_name'] = teacher_name
            latest_detections['person_detected'] = person
            latest_detections['gesture_detected'] = gesture
            latest_detections['status'] = status
            latest_detections['color'] = color

def main():

    cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
    # cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)
    # cv2.setWindowProperty(WINDOW_NAME, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

    # Make window resizable
    cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(WINDOW_NAME, 1280, 720)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_SIZE[0])
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_SIZE[1])

    prev = time.time()
    frame_count = 0

    recognizer = TeacherRecognizer()
    voice_detector = VoiceDetector()
    
    # Start background detection thread
    frame_queue = Queue(maxsize=1)
    detection_thread = threading.Thread(target=detection_worker, args=(frame_queue, recognizer, voice_detector), daemon=True)
    detection_thread.start()

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1
        now = time.time()
        fps = 1/(now-prev) if (now-prev) > 0 else 0
        prev = now

        # Queue frame for processing every N frames (non-blocking)
        if frame_count % PROCESS_EVERY_N_FRAMES == 0:
            try:
                frame_queue.put_nowait(frame.copy())
            except:
                pass  # Skip if queue is full

        # Get latest detections
        with detection_lock:
            teacher_detected = latest_detections['teacher_detected']
            teacher_name = latest_detections['teacher_name']
            person = latest_detections['person_detected']
            gesture = latest_detections['gesture_detected']
            status = latest_detections['status']
            color = latest_detections['color']

        # Add teacher verification info
        if teacher_detected:
            teacher_status = f"Teacher Verified: {teacher_name}"
        else:
            teacher_status = "Teacher Not Detected"

        # frame = cv2.resize(frame, (1280, 720))
        # Draw teacher status
        cv2.putText(frame,
                    teacher_status,
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 255, 0) if teacher_detected else (0, 0, 255),
                    2)

        # Draw system status
        cv2.putText(frame,
                    status,
                    (20, 80),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    color,
                    3)

        # Draw FPS
        cv2.putText(frame,
                    f"FPS: {fps:.2f}",
                    (20, 120),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (255,255,255),
                    2)

        cv2.imshow(WINDOW_NAME, frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Stop detection thread
    frame_queue.put(None)
    detection_thread.join(timeout=2)
    
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()