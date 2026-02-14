import time
import cv2

from config import CAMERA_INDEX, WINDOW_NAME

from person_detector import detect_person
from pose_detector import detect_gesture
from voice_detector import detect_voice
from decision_engine import decide


def main():

    cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    prev = time.time()

    while True:

        ret, frame = cap.read()

        now = time.time()
        fps = 1/(now-prev)
        prev = now

        print(f"FPS: {fps:.2f}")

        if not ret:
            break

        person, frame = detect_person(frame)

        gesture, frame = detect_gesture(frame)

        voice = detect_voice()

        status, color = decide(person, gesture, voice)

        cv2.putText(frame,
                    status,
                    (20,40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    color,
                    3)

        cv2.imshow(WINDOW_NAME, frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()