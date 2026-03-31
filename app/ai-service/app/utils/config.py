from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[4]

# CAMERA_INDEX = str(BASE_DIR / "data" / "test" / "video" / "teaching.mp4")

CAMERA_INDEX = 0  # Default to first webcam

VOICE_THRESHOLD = 5

WINDOW_NAME = "EduWatch - Teacher Activity Detection"

FONT = 0  # cv2.FONT_HERSHEY_SIMPLEX
FONT_SCALE = 0.6
FONT_COLOR = (0, 255, 0) # Green color for detected activities