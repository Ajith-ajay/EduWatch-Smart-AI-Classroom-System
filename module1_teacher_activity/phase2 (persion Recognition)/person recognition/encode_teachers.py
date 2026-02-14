import face_recognition
import os
import pickle

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "teacher_db")

OUTPUT_PATH = os.path.join(BASE_DIR, "..", "teacher_encodings.pkl")

encodings = []
names = []

for file in os.listdir(DB_PATH):

    if file.endswith(".jpg") or file.endswith(".png") or file.endswith(".jpeg"):

        path = os.path.join(DB_PATH, file)

        image = face_recognition.load_image_file(path)

        face_enc = face_recognition.face_encodings(image)

        if len(face_enc) == 0:
            print(f"No face found in {file}")
            continue

        encodings.append(face_enc[0])
        names.append(os.path.splitext(file)[0])

data = {
    "encodings": encodings,
    "names": names
}

with open(OUTPUT_PATH, "wb") as f:
    pickle.dump(data, f)

print("Teacher database encoded successfully")