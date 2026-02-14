import cv2
import pickle
import face_recognition
import os

# Fix path to load pkl (outside person_recognition)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_PATH = os.path.join(BASE_DIR, "..", "teacher_encodings.pkl")

# Load encodings
print("[INFO] Loading teacher encodings...")

with open(PKL_PATH, "rb") as f:
    data = pickle.load(f)

print(f"[INFO] Loaded {len(data['names'])} teachers:", data["names"])

# Start webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("[ERROR] Cannot open webcam")
    exit()

print("[INFO] Starting recognition test. Press 'q' to quit.")

while True:

    ret, frame = cap.read()

    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    boxes = face_recognition.face_locations(rgb)

    encodings = face_recognition.face_encodings(rgb, boxes)

    for encoding, box in zip(encodings, boxes):

        matches = face_recognition.compare_faces(
            data["encodings"],
            encoding,
            tolerance=0.5
        )

        name = "Unknown"

        if True in matches:
            idx = matches.index(True)
            name = data["names"][idx]

        top, right, bottom, left = box

        # Draw rectangle
        cv2.rectangle(frame,
                      (left, top),
                      (right, bottom),
                      (0, 255, 0),
                      2)

        # Draw name
        cv2.putText(frame,
                    name,
                    (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 255, 0),
                    2)

    cv2.imshow("Teacher Recognition Test", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()