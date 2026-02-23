import time
import cv2
import threading
from queue import Queue

from person_detector import detect_person
from pose_detector import detect_gesture
from voice_detector import VoiceDetector
from decision_engine import decide
from recognizer import TeacherRecognizer
from client.backend_client import send_attendance


# Frame processing
PROCESS_EVERY_N_FRAMES = 3
FRAME_SIZE = (1280, 720)
API_CALL_INTERVAL = 5


class CameraProcessor:

    def __init__(self, camera_source, window_name):

        self.camera_source = camera_source
        self.window_name = window_name

        if isinstance(camera_source, int):
            # USB camera
            self.cap = cv2.VideoCapture(camera_source, cv2.CAP_DSHOW)
        else:
            # Video file or RTSP
            self.cap = cv2.VideoCapture(camera_source)

        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

        if isinstance(camera_source, int):
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_SIZE[0])
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_SIZE[1])

        if not self.cap.isOpened():
            print(f"[ERROR] Could not open source {camera_source}")

        self.frame_queue = Queue(maxsize=1)
        self.lock = threading.Lock()

        self.recognizer = TeacherRecognizer()
        self.voice_detector = VoiceDetector()

        self.latest_detections = {
            'teacher_detected': False,
            'teacher_name': None,
            'teacher_id': None,
            'confidence_score': 0.0,
            'status': 'Initializing...',
            'color': (255, 255, 255)
        }

        self.last_api_call = 0
        self.running = True

        self.detection_thread = threading.Thread(
            target=self.detection_worker,
            daemon=True
        )

    def start(self):
        self.detection_thread.start()
        self.capture_loop()

    def stop(self):
        self.running = False
        self.frame_queue.put(None)
        self.detection_thread.join(timeout=2)
        self.cap.release()
        cv2.destroyWindow(self.window_name)

    def detection_worker(self):

        while True:
            frame = self.frame_queue.get()
            if frame is None:
                break

            teacher_detected, teacher_name, teacher_id, similarity_score, _ = \
                self.recognizer.recognize(frame)

            person, _ = detect_person(frame)
            gesture, _ = detect_gesture(frame)
            voice = self.voice_detector.detect_voice()

            status, color = decide(teacher_detected, person, gesture, voice)

            with self.lock:
                self.latest_detections.update({
                    'teacher_detected': teacher_detected,
                    'teacher_name': teacher_name,
                    'teacher_id': teacher_id,
                    'confidence_score': similarity_score,
                    'status': status,
                    'color': color
                })

    def capture_loop(self):

        cv2.namedWindow(self.window_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self.window_name, FRAME_SIZE[0], FRAME_SIZE[1])

        prev = time.time()
        frame_count = 0

        while self.running:

            ret, frame = self.cap.read()
            if not ret:
                if isinstance(self.camera_source, str):
                    # Restart video
                    self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
                else:
                    print(f"[ERROR] Camera {self.camera_source} failed.")
                    break

            frame_count += 1

            now = time.time()
            fps = 1 / (now - prev) if (now - prev) > 0 else 0
            prev = now

            if frame_count % PROCESS_EVERY_N_FRAMES == 0:
                try:
                    self.frame_queue.put_nowait(frame.copy())
                except:
                    pass

            with self.lock:
                teacher_detected = self.latest_detections['teacher_detected']
                teacher_name = self.latest_detections['teacher_name']
                teacher_id = self.latest_detections['teacher_id']
                confidence_score = self.latest_detections['confidence_score']
                status = self.latest_detections['status']
                color = self.latest_detections['color']

            # Controlled backend call
            if time.time() - self.last_api_call > API_CALL_INTERVAL:

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

                self.last_api_call = time.time()

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
                        (255, 255, 255),
                        2)

            cv2.imshow(self.window_name, frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.running = False
                break

        self.stop()


def main():

    # 🔹 Change this to test multiple rooms
    camera_sources = [
        0,     # USB cam 1
        # 1,     # USB cam 2
        # r"data/test/video/teaching.mp4",
        # r"data/test/video/teaching1.mp4",
        # "rtsp://192.168.1.10/stream"
    ]

    processors = []

    try:
        for i, src in enumerate(camera_sources):
            processor = CameraProcessor(src, f"Room {i}")
            thread = threading.Thread(target=processor.start)
            thread.start()
            processors.append((processor, thread))

        for processor, thread in processors:
            thread.join()

    except KeyboardInterrupt:
        print("Shutting down...")
        for processor, _ in processors:
            processor.stop()


if __name__ == "__main__":
    main()