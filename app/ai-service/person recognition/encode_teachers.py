import face_recognition
import os
import pickle
import psycopg2

# ------------------------------
# Configuration
# ------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "teacher_db")
OUTPUT_PATH = os.path.join(BASE_DIR, "..", "app", "models", "teacher_encodings.pkl")

DB_CONFIG = {
    "host": "localhost",
    "database": "eduwatch",
    "user": "postgres",
    "password": "peace",
    "port": 5432
}

# ------------------------------
# Connect to PostgreSQL
# ------------------------------

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

encodings = []
names = []
ids = []

for file in os.listdir(DB_PATH):

    if file.lower().endswith((".jpg", ".png", ".jpeg")):

        teacher_name = os.path.splitext(file)[0]

        # Fetch teacher_id from database
        cursor.execute(
            "SELECT teacher_id FROM teachers WHERE full_name = %s",
            (teacher_name,)
        )

        result = cursor.fetchone()

        if result is None:
            print(f"❌ Teacher '{teacher_name}' not found in DB. Skipping.")
            continue

        teacher_id = result[0]

        path = os.path.join(DB_PATH, file)
        image = face_recognition.load_image_file(path)
        face_enc = face_recognition.face_encodings(image)

        if len(face_enc) == 0:
            print(f"No face found in {file}")
            continue

        encodings.append(face_enc[0])
        names.append(teacher_name)
        ids.append(teacher_id)

        print(f"✅ Encoded: {teacher_name} (ID: {teacher_id})")

# Close DB connection
cursor.close()
conn.close()

data = {
    "encodings": encodings,
    "names": names,
    "ids": ids
}

with open(OUTPUT_PATH, "wb") as f:
    pickle.dump(data, f)

print("🎉 Teacher database encoded successfully with IDs")