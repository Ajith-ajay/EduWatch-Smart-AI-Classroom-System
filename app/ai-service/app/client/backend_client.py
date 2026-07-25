import requests

API_URL = "http://127.0.0.1:8000/mark-attendance"

def send_attendance(detected_teacher_id, confidence_score):

    payload = {
        "detected_teacher_id": detected_teacher_id,
        "confidence_score": confidence_score
    }

    try:
        response = requests.post(API_URL, json=payload)
        print("Backend Response:", response.json())
    except Exception as e:
        print("Error connecting to backend:", e)