import mediapipe as mp
import cv2
import numpy as np
from collections import deque

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

mp_draw = mp.solutions.drawing_utils

# Track wrist movement history
wrist_history = deque(maxlen=10)

MOVEMENT_THRESHOLD = 0.02  # tune if needed


def detect_gesture(frame):

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = pose.process(rgb)

    gesture_active = False

    if result.pose_landmarks:

        landmarks = result.pose_landmarks.landmark

        right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
        left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]

        # Use normalized coordinates
        current_position = (
            (right_wrist.x + left_wrist.x) / 2,
            (right_wrist.y + left_wrist.y) / 2
        )

        wrist_history.append(current_position)

        if len(wrist_history) >= 2:
            prev = wrist_history[-2]
            curr = wrist_history[-1]

            movement = np.sqrt(
                (curr[0] - prev[0])**2 +
                (curr[1] - prev[1])**2
            )

            if movement > MOVEMENT_THRESHOLD:
                gesture_active = True

        mp_draw.draw_landmarks(
            frame,
            result.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

    return gesture_active, frame