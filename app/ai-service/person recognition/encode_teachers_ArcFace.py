import os
import pickle
import cv2
import psycopg2
from insightface.app import FaceAnalysis
import numpy as np

# ------------------------------
# Configuration
# ------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "teacher_db")
OUTPUT_PATH = os.path.join(BASE_DIR, "..", "app", "models", "teacher_arcface.pkl")

DB_CONFIG = {
    "host": "localhost",
    "database": "eduwatch",
    "user": "postgres",
    "password": "peace",
    "port": 5432
}

# ------------------------------
# Initialize ArcFace
# ------------------------------

app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]  # Use CUDAExecutionProvider if GPU available
)
app.prepare(ctx_id=0, det_size=(640, 640))

# ------------------------------
# Connect to PostgreSQL
# ------------------------------

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
except Exception as e:
    raise RuntimeError(f"Database connection failed: {e}")

embeddings = []
names = []
ids = []

for file in os.listdir(DB_PATH):

    if not file.lower().endswith((".jpg", ".png", ".jpeg")):
        continue

    teacher_id_str = os.path.splitext(file)[0]

    # Validate numeric filename
    if not teacher_id_str.isdigit():
        print(f"⚠ Skipping {file} — filename must be teacher_id.")
        continue

    teacher_id = int(teacher_id_str)

    # Fetch teacher name from DB
    cursor.execute(
        "SELECT full_name FROM teachers WHERE teacher_id = %s",
        (teacher_id,)
    )

    result = cursor.fetchone()

    if result is None:
        print(f"❌ Teacher ID {teacher_id} not found in DB. Skipping.")
        continue

    teacher_name = result[0]

    path = os.path.join(DB_PATH, file)
    image = cv2.imread(path)

    if image is None:
        print(f"❌ Could not read image {file}")
        continue

    faces = app.get(image)

    if len(faces) == 0:
        print(f"⚠ No face found in {file}")
        continue

    if len(faces) > 1:
        print(f"⚠ Multiple faces found in {file}. Using first face.")

    embedding = faces[0].embedding

    embeddings.append(embedding)
    names.append(teacher_name)
    ids.append(teacher_id)

    print(f"✅ Encoded: {teacher_name} (ID: {teacher_id})")

# Close DB connection
cursor.close()
conn.close()

data = {
    "embeddings": np.array(embeddings),
    "names": names,
    "ids": ids
}

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

with open(OUTPUT_PATH, "wb") as f:
    pickle.dump(data, f)

print("🎉 ArcFace teacher database encoded successfully.")