import face_recognition
import pickle
import cv2
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_PATH = os.path.join(BASE_DIR, "teacher_encodings.pkl")

class TeacherRecognizer:

    def __init__(self):

        with open(PKL_PATH, "rb") as f:
            self.data = pickle.load(f)

    def recognize(self, frame):

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        boxes = face_recognition.face_locations(rgb)

        encodings = face_recognition.face_encodings(rgb, boxes)

        teacher_detected = False
        teacher_name = None

        for encoding, box in zip(encodings, boxes):

            matches = face_recognition.compare_faces(
                self.data["encodings"], encoding, tolerance=0.5)

            if True in matches:

                idx = matches.index(True)

                teacher_name = self.data["names"][idx]

                teacher_detected = True

                top, right, bottom, left = box

                cv2.rectangle(frame,
                              (left, top),
                              (right, bottom),
                              (0,255,0), 2)

                cv2.putText(frame,
                            teacher_name,
                            (left, top-10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.8,
                            (0,255,0),
                            2)

        return teacher_detected, teacher_name, frame