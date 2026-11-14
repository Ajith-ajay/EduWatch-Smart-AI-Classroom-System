# main.py – FastAPI entry point for EduWatch backend

# pyrefly: ignore [missing-import]
import uvicorn
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Import services (stubs)
from eduwatch.services.person_detection import detect_people
from eduwatch.services.face_recognition import load_known_embeddings, extract_face_embeddings, match_teacher
from eduwatch.services.pose_detection import analyze_frame
from eduwatch.core.logger import get_logger
from eduwatch.config.settings import settings

logger = get_logger()

app = FastAPI(title=settings.PROJECT_NAME)
security = HTTPBearer()

class FramePayload(BaseModel):
    """Base64‑encoded image frame (placeholder)."""
    image_data: str

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Simple placeholder verification – in production use python-jose with JWT settings
    token = credentials.credentials
    if token != "dummy-token":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return True

@app.post("/score")
async def compute_score(payload: FramePayload, authorized: bool = Depends(verify_token)):
    """Compute the Teaching Score from a single video frame.
    This is a stub implementation that demonstrates the pipeline:
    1. Detect persons (YOLO)
    2. Detect faces & match teacher
    3. Pose & gesture analysis
    4. Combine with weighted formula
    """
    import base64
    import numpy as np
    import cv2

    # Decode image
    try:
        img_bytes = base64.b64decode(payload.image_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        logger.error(f"Failed to decode image: {e}")
        raise HTTPException(status_code=400, detail="Invalid image data")

    # 1. Person detection (YOLO) – stub returns empty list if model not loaded
    persons = detect_people(frame)

    # 2. Face recognition – using detected person boxes as face boxes for demo
    face_boxes = [(x1, y1, x2, y2) for (x1, y1, x2, y2, _) in persons]
    embeddings = extract_face_embeddings(frame, face_boxes)
    known = load_known_embeddings()
    matches = match_teacher(embeddings, known)
    face_score = sum(conf for _, conf in matches) / max(len(matches), 1)

    # 3. Pose & gesture analysis
    pose_info = analyze_frame(frame)
    pose_score = pose_info.get("pose_score", 0.0)
    gesture_score = pose_info.get("gesture_score", 0.0)

    # 4. Simple weighted formula (same as recommendation)
    # Voice detection is omitted in this stub – set to 0
    voice_score = 0.0
    movement_score = 0.0  # placeholder
    teaching_score = (
        0.35 * voice_score +
        0.25 * face_score +
        0.20 * gesture_score +
        0.10 * pose_score +
        0.10 * movement_score
    ) * 100

    result = {
        "teaching_score": round(teaching_score, 2),
        "components": {
            "voice": voice_score,
            "face": face_score,
            "gesture": gesture_score,
            "pose": pose_score,
            "movement": movement_score,
        },
        "persons_detected": len(persons),
        "faces_matched": len(matches),
    }
    logger.info("Score computed", result=result)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
