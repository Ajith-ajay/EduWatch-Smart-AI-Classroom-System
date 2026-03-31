import face_recognition
import pickle
import cv2
import os
import numpy as np
from insightface.app import FaceAnalysis
from sklearn.metrics.pairwise import cosine_similarity

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

        rgb_original = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        cl = clahe.apply(gray)
        rgb_for_detection = cv2.cvtColor(cl, cv2.COLOR_GRAY2RGB)

        boxes = face_recognition.face_locations(rgb_for_detection, model="hog")

        encodings = face_recognition.face_encodings(rgb_original, boxes, model="large")

        teacher_detected = False
        teacher_name = None
        teacher_id = None
        similarity_score = 0.0
        face_bbox = None

        for encoding, box in zip(encodings, boxes):

            distances = face_recognition.face_distance(self.known_encodings, encoding)

            if len(distances) == 0:
                continue

            best_match_index = np.argmin(distances)
            best_distance = distances[best_match_index]

            if best_distance >= self.tolerance:
                continue

            teacher_detected = True
            teacher_name = self.known_names[best_match_index]
            teacher_id = self.known_ids[best_match_index]

            similarity_score = (1 - best_distance) * 100

            top, right, bottom, left = box
            face_bbox = (left, top, right, bottom)


            cv2.rectangle(frame,
                            (left, top),
                            (right, bottom),
                            (0,255,0), 2)

            cv2.putText(frame,
                        f"{teacher_name} ({similarity_score:.2f}%)",
                        (left, top-10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8,
                        (0,255,0),
                        2)

            break  # Stop after first valid teacher match

        return teacher_detected, teacher_name, teacher_id, similarity_score, frame, face_bbox
    



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_PATH_ARC = os.path.join(BASE_DIR, "..", "models", "teacher_arcface.pkl")


class TeacherRecognizerArcFace:

    def __init__(self):

        # Load ArcFace model
        self.app = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"]  # change to CUDAExecutionProvider if GPU
        )
        self.app.prepare(ctx_id=0, det_size=(640, 640))

        # Load stored embeddings
        with open(PKL_PATH_ARC, "rb") as f:
            self.data = pickle.load(f)

        self.known_embeddings = self.data["embeddings"]
        self.known_names = self.data["names"]
        self.known_ids = self.data["ids"]

        # Cosine similarity threshold
        # Higher = stricter (range -1 to 1)
        self.similarity_threshold = 0.55

    def recognize(self, frame):

        teacher_detected = False
        teacher_name = None
        teacher_id = None
        similarity_score = 0.0

        faces = self.app.get(frame)

        for face in faces:

            box = face.bbox.astype(int)
            x1, y1, x2, y2 = box
            face_bbox = (x1, y1, x2, y2)

            # Minimum face size filter
            if (x2 - x1) < 80 or (y2 - y1) < 80:
                continue

            embedding = face.embedding.reshape(1, -1)

            similarities = cosine_similarity(
                embedding,
                self.known_embeddings
            )[0]

            best_index = np.argmax(similarities)
            best_score = similarities[best_index]

            if best_score < self.similarity_threshold:
                continue

            # Ambiguity check
            sorted_scores = np.sort(similarities)
            if len(sorted_scores) > 1:
                if (sorted_scores[-1] - sorted_scores[-2]) < 0.03:
                    continue

            teacher_detected = True
            teacher_name = self.known_names[best_index]
            teacher_id = self.known_ids[best_index]
            similarity_score = round(best_score * 100, 2)

            cv2.rectangle(frame,
                          (x1, y1),
                          (x2, y2),
                          (0, 255, 0), 2)

            cv2.putText(frame,
                        f"{teacher_name} ({similarity_score}%)",
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8,
                        (0, 255, 0),
                        2)

            break

        return teacher_detected, teacher_name, teacher_id, similarity_score, frame, face_bbox