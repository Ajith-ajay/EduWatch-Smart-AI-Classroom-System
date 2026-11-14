# person_detection.py – Wrapper around YOLOv8 for person detection

# pyrefly: ignore [missing-import]
from ultralytics import YOLO
import numpy as np
import cv2
from typing import List, Tuple

# Load the YOLOv8n model (lightweight) – path can be overridden via env if needed
MODEL_PATH = "yolov8n.pt"

yolo_model = YOLO(MODEL_PATH)

def detect_people(frame: "np.ndarray") -> List[Tuple[int, int, int, int, float]]:
    """Detect persons in a video frame.

    Returns a list of bounding boxes with confidence scores:
        [(x1, y1, x2, y2, confidence), ...]
    Only "person" class (class id 0) is returned.
    """
    results = yolo_model(frame)
    boxes = []
    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            if cls == 0:  # person class
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                conf = float(box.conf[0])
                boxes.append((x1, y1, x2, y2, conf))
    return boxes
