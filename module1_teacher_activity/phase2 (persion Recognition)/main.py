import time
import cv2

from config import CAMERA_INDEX, WINDOW_NAME

from person_detector import detect_person
from pose_detector import detect_gesture
from voice_detector import detect_voice
from decision_engine import decide
from recognizer import TeacherRecognizer


def main():

    cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    prev = time.time()

    recognizer = TeacherRecognizer()

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        now = time.time()
        fps = 1/(now-prev)
        prev = now

        # Detect teacher
        teacher_detected, teacher_name, frame = recognizer.recognize(frame)

        # Detect person
        person, frame = detect_person(frame)

        # Detect gesture
        gesture, frame = detect_gesture(frame)

        # voice detection (optional)
        voice = None
        # voice = detect_voice()

        # Decision engine
        status, color = decide(person, gesture, voice)

        # Add teacher verification info
        if teacher_detected:
            teacher_status = f"Teacher Verified: {teacher_name}"
        else:
            teacher_status = "Teacher Not Found"

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

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()