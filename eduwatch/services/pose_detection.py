# pose_detection.py – Wrapper for MediaPipe pose & hand gesture detection

import cv2
# pyrefly: ignore [missing-import]
import mediapipe as mp
from typing import Dict, Any

mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands

pose = mp_pose.Pose(static_image_mode=False, model_complexity=1, enable_segmentation=False, min_detection_confidence=0.5)
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)

def analyze_frame(frame):
    """Detect pose landmarks and hand gestures.
    Returns a dict with pose_score (0‑1) and gesture_score (0‑1).
    """
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pose_results = pose.process(rgb)
    hand_results = hands.process(rgb)

    pose_score = 0.0
    if pose_results.pose_landmarks:
        # Simple heuristic: count visible landmarks
        pose_score = len(pose_results.pose_landmarks.landmark) / 33

    gesture_score = 0.0
    if hand_results.multi_hand_landmarks:
        gesture_score = min(1.0, len(hand_results.multi_hand_landmarks) / 2)

    return {"pose_score": min(1.0, pose_score), "gesture_score": gesture_score}
