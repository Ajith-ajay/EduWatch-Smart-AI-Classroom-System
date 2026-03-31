import os
import time
import cv2
import threading
from queue import Queue

from utils.config import CAMERA_INDEX, WINDOW_NAME

from services.person_detector import detect_person
from services.pose_detector import detect_gesture
from services.decision_engine import decide
from services.head_pose_detector import detect_head_pose, classify_head_pose
from services.voice_detector import VoiceDetector
from services.teaching_activity_engine import TeachingActivityEngine
from services.recognizer import TeacherRecognizerArcFace, TeacherRecognizer
from client.backend_client import send_attendance

# Frame processing
PROCESS_EVERY_N_FRAMES = 3
FRAME_SIZE = (1280, 720)

# Backend call interval (seconds)
API_CALL_INTERVAL = 5

# Shared detection state
detection_lock = threading.Lock()
latest_detections = {
    'teacher_detected': False,
    'teacher_name': None,
    'teacher_id': None,
    'confidence_score': 0.0,
    'person_detected': False,
    'gesture_detected': False,
    'teaching_score': 0.0,
    'status': 'Initializing...',
    'color': (255, 255, 255)
}

def detection_worker(frame_queue, recognizer, voice_detector, teaching_activity_engine):
    """Background thread for heavy ML operations"""
    while True:
        frame = frame_queue.get()
        if frame is None:
            break

        # Teacher recognition (must return id + confidence)
        teacher_detected, teacher_name, teacher_id, similarity_score, _, face_bbox = recognizer.recognize(frame)

        yaw, pitch = 0, 0
        facing_forward = False

        if teacher_detected and face_bbox is not None:

            x1, y1, x2, y2 = face_bbox

            teacher_face = frame[y1:y2, x1:x2]

            if teacher_face.size > 0:
                facing_forward, yaw, pitch, _ = detect_head_pose(teacher_face)

        head_state = classify_head_pose(yaw, pitch)

        person, _ = detect_person(frame)
        gesture, _ = detect_gesture(frame)
        voice = voice_detector.detect_voice()

        # status, color = decide(teacher_detected, person, gesture, voice)
        teaching_score, status, color = teaching_activity_engine.update(
            teacher=teacher_detected,
            gesture=gesture,
            speech=voice,
            person=person,
            facing_forward=facing_forward,
            head_state=head_state
        )

        with detection_lock:
            latest_detections.update({
                'teacher_detected': teacher_detected,
                'teacher_name': teacher_name,
                'teacher_id': teacher_id,
                'confidence_score': similarity_score,
                'person_detected': person,
                'gesture_detected': gesture,
                'teaching_score': teaching_score,
                'status': status,
                'color': color
            })

def main():

    if isinstance(CAMERA_INDEX, int):
        cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
    else:
        cap = cv2.VideoCapture(CAMERA_INDEX)

    if not cap.isOpened():
        print("ERROR: Video source not found")
        exit()
    
    cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(WINDOW_NAME, 1280, 720)

    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_SIZE[0])
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_SIZE[1])

    prev = time.time()
    frame_count = 0
    last_api_call = 0

    recognizerArcFace = TeacherRecognizerArcFace()
    recognizer = TeacherRecognizer()
    voice_detector = VoiceDetector()
    teaching_activity_engine = TeachingActivityEngine()

    frame_queue = Queue(maxsize=1)
    detection_thread = threading.Thread(
        target=detection_worker,
        args=(frame_queue, recognizerArcFace, voice_detector, teaching_activity_engine),
        daemon=True
    )
    detection_thread.start()

    while True:

        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        now = time.time()
        fps = 1/(now-prev) if (now-prev) > 0 else 0
        prev = now

        if frame_count % PROCESS_EVERY_N_FRAMES == 0:
            try:
                frame_queue.put_nowait(frame.copy())
            except:
                pass

        with detection_lock:
            teacher_detected = latest_detections['teacher_detected']
            teacher_name = latest_detections['teacher_name']
            teacher_id = latest_detections['teacher_id']
            confidence_score = latest_detections['confidence_score']
            teaching_score = latest_detections['teaching_score']
            status = latest_detections['status']
            color = latest_detections['color']

        # 🔥 Controlled backend call (every 5 seconds only)
        if time.time() - last_api_call > API_CALL_INTERVAL:

            if teacher_detected:
                send_attendance(
                    detected_teacher_id=teacher_id,
                    confidence_score=confidence_score
                )
            else:
                send_attendance(
                    detected_teacher_id=None,
                    confidence_score=0.0
                )

            last_api_call = time.time()

        # Display info
        teacher_status = (
            f"Teacher Verified: {teacher_name}"
            if teacher_detected else
            "Teacher Not Detected"
        )

        cv2.putText(frame, teacher_status,
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 255, 0) if teacher_detected else (0, 0, 255),
                    2)

        cv2.putText(frame, status,
                    (20, 80),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    color,
                    3)

        cv2.putText(frame, f"FPS: {fps:.2f}",
                    (20, 120),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (255,255,255),
                    2)
        
        cv2.putText(frame, f"Teaching Score: {teaching_score:.2f}",
                    (20, 160),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (255,255,255),
                    2)

        cv2.imshow(WINDOW_NAME, frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    frame_queue.put(None)
    detection_thread.join(timeout=2)

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()