import face_recognition
import pickle
import cv2
import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_PATH = os.path.join(BASE_DIR, "..", "models", "teacher_encodings.pkl")

class TeacherRecognizer:

    def __init__(self):

        with open(PKL_PATH, "rb") as f:
            self.data = pickle.load(f)

        self.known_encodings = self.data["encodings"]
        self.known_names = self.data["names"]
        self.known_ids = self.data["ids"]

        # Lower value = stricter matching
        self.tolerance = 0.5

    def recognize(self, frame):

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        boxes = face_recognition.face_locations(rgb)
        encodings = face_recognition.face_encodings(rgb, boxes)

        teacher_detected = False
        teacher_name = None
        teacher_id = None
        similarity_score = 0.0

        for encoding, box in zip(encodings, boxes):

            # Calculate distances
            distances = face_recognition.face_distance(
                self.known_encodings, encoding)

            if len(distances) == 0:
                continue

            best_match_index = np.argmin(distances)
            best_distance = distances[best_match_index]

            if best_distance < self.tolerance:

                teacher_detected = True
                teacher_name = self.known_names[best_match_index]
                teacher_id = self.known_ids[best_match_index]

                # Convert distance to confidence %
                similarity_score = round((1 - best_distance) * 100, 2)

                top, right, bottom, left = box

                cv2.rectangle(frame,
                              (left, top),
                              (right, bottom),
                              (0,255,0), 2)

                cv2.putText(frame,
                            f"{teacher_name} ({similarity_score}%)",
                            (left, top-10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.8,
                            (0,255,0),
                            2)

                break  # Stop after first valid teacher match

        return teacher_detected, teacher_name, teacher_id, similarity_score, frame