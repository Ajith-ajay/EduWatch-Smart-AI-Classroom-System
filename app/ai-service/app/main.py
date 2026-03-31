import os
import time
import cv2
import threading
import logging
from queue import Queue

# Configure logging for model conclusion
logging.basicConfig(
    filename='eduwatch_activity.log',
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

from utils.config import CAMERA_INDEX, WINDOW_NAME

from services.person_detector import detect_person
from services.pose_detector import detect_gesture
from services.decision_engine import decide
from services.head_pose_detector import detect_head_pose, classify_head_pose
from services.voice_detector import VoiceDetector
from services.teaching_activity_engine import TeachingActivityEngine
from services.recognizer import TeacherRecognizerArcFace, TeacherRecognizer
from client.backend_client import send_attendance

class TeacherSessionManager:
    def __init__(self, timeout_seconds=1800): # 30 mins session lock
        self.cached_teacher_id = None
        self.cached_teacher_name = None
        self.cached_confidence = 0.0
        self.last_seen_time = 0
        self.timeout = timeout_seconds

    def update(self, detected, name, tid, conf):
        now = time.time()
        if detected:
            self.cached_teacher_name = name
            self.cached_teacher_id = tid
            self.cached_confidence = conf
            self.last_seen_time = now
            return True, name, tid, conf
        
        if self.cached_teacher_id and (now - self.last_seen_time < self.timeout):
            return True, self.cached_teacher_name, self.cached_teacher_id, self.cached_confidence
        
        return False, None, None, 0.0

session_manager = TeacherSessionManager()

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
        raw_detected, raw_name, raw_id, raw_score, _, face_bbox = recognizer.recognize(frame)

        # Apply Session Caching
        active_teacher, active_name, active_id, active_score = session_manager.update(
            raw_detected, raw_name, raw_id, raw_score
        )

        yaw, pitch = 0, 0
        facing_forward = False

        if raw_detected and face_bbox is not None:

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
            teacher=active_teacher,
            gesture=gesture,
            speech=voice,
            person=person,
            facing_forward=facing_forward,
            head_state=head_state
        )

        with detection_lock:
            latest_detections.update({
                'teacher_detected': active_teacher,
                'teacher_name': active_name,
                'teacher_id': active_id,
                'confidence_score': active_score,
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
    last_logged_status = None

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

        # Log status changes
        if status != last_logged_status and status != 'Initializing...':
            logging.info(f"Activity Status Changed: {status} | Score: {teaching_score:.2f} | Teacher: {teacher_name or 'None'}")
            last_logged_status = status

        # 🔥 Controlled backend call (every 5 seconds only)
        if time.time() - last_api_call > API_CALL_INTERVAL:

            if teacher_detected:
                logging.info(f"API CALL: Sending attendance for {teacher_name} (ID: {teacher_id}) with confidence {confidence_score:.2f}")
                send_attendance(
                    detected_teacher_id=teacher_id,
                    confidence_score=confidence_score
                )
            else:
                logging.info(f"API CALL: No active teacher. Sending null attendance.")
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