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

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
except Exception as e:
    raise RuntimeError(f"Database connection failed: {e}")

encodings = []
names = []
ids = []

for file in os.listdir(DB_PATH):

    if file.lower().endswith((".jpg", ".png", ".jpeg")):

        # Extract teacher_id from filename
        teacher_id_str = os.path.splitext(file)[0]

        # Validate teacher_id is numeric
        if not teacher_id_str.isdigit():
            print(f"⚠️ Skipping '{file}' — filename is not a valid numeric teacher_id.")
            continue

        teacher_id = int(teacher_id_str)

        # Fetch teacher name using ID
        cursor.execute(
            "SELECT full_name FROM teachers WHERE teacher_id = %s",
            (teacher_id,)
        )

        result = cursor.fetchone()

        if result is None:
            print(f"❌ Teacher ID '{teacher_id}' not found in DB. Skipping.")
            continue

        teacher_name = result[0]

        path = os.path.join(DB_PATH, file)

        try:
            image = face_recognition.load_image_file(path)
            face_enc = face_recognition.face_encodings(image, model="large")
        except Exception as e:
            print(f"❌ Error processing {file}: {e}")
            continue

        if len(face_enc) == 0:
            print(f"⚠️ No face found in {file}")
            continue

        if len(face_enc) > 1:
            print(f"⚠️ Multiple faces found in {file}. Using first detected face.")

        encodings.append(face_enc[0])
        names.append(teacher_name)
        ids.append(teacher_id)

        print(f"✅ Encoded: {teacher_name} (ID: {teacher_id})")

# Close DB connection safely
cursor.close()
conn.close()

data = {
    "encodings": encodings,
    "ids": ids,
    "names": names
}

# Ensure output directory exists
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

with open(OUTPUT_PATH, "wb") as f:
    pickle.dump(data, f)

print("🎉 Teacher database encoded successfully using teacher IDs.")