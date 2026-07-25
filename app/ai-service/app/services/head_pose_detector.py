import cv2
import numpy as np
import mediapipe as mp

mp_face = mp.solutions.face_mesh
face_mesh = mp_face.FaceMesh(refine_landmarks=True)

# 3D model reference points (generic face model)
MODEL_POINTS = np.array([
    (0.0, 0.0, 0.0),          # Nose tip
    (0.0, -330.0, -65.0),     # Chin
    (-225.0, 170.0, -135.0),  # Left eye left corner
    (225.0, 170.0, -135.0),   # Right eye right corner
    (-150.0, -150.0, -125.0), # Left mouth corner
    (150.0, -150.0, -125.0)   # Right mouth corner
], dtype=np.float64)


def detect_head_pose(frame):

    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return False, 0, 0, frame

    face_landmarks = results.multi_face_landmarks[0]

    image_points = np.array([
        (face_landmarks.landmark[1].x * w, face_landmarks.landmark[1].y * h),    # Nose
        (face_landmarks.landmark[152].x * w, face_landmarks.landmark[152].y * h),# Chin
        (face_landmarks.landmark[33].x * w, face_landmarks.landmark[33].y * h),  # Left eye
        (face_landmarks.landmark[263].x * w, face_landmarks.landmark[263].y * h),# Right eye
        (face_landmarks.landmark[61].x * w, face_landmarks.landmark[61].y * h),  # Left mouth
        (face_landmarks.landmark[291].x * w, face_landmarks.landmark[291].y * h) # Right mouth
    ], dtype=np.float64)

    focal_length = w
    center = (w/2, h/2)

    camera_matrix = np.array([
        [focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]
    ], dtype="double")

    dist_coeffs = np.zeros((4,1))

    success, rotation_vector, translation_vector = cv2.solvePnP(
        MODEL_POINTS,
        image_points,
        camera_matrix,
        dist_coeffs,
        flags=cv2.SOLVEPNP_ITERATIVE
    )

    if not success:
        return False, 0, 0, frame

    rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
    angles, _, _, _, _, _ = cv2.RQDecomp3x3(rotation_matrix)

    pitch, yaw, roll = angles

    # Facing forward condition
    facing_forward = abs(yaw) < 20 and abs(pitch) < 20

    print(f"Head Pose - Yaw: {yaw:.2f}, Pitch: {pitch:.2f}, Roll: {roll:.2f}, Facing Forward: {facing_forward}")

    cv2.putText(frame,
            f"Yaw:{yaw:.1f} Pitch:{pitch:.1f}",
            (20, 200),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255,255,0),
            2)

    return facing_forward, yaw, pitch, frame

def classify_head_pose(yaw, pitch):

    if abs(yaw) < 20 and abs(pitch) < 20:
        return "LOOKING_AT_CLASS"

    elif abs(yaw) > 40:
        return "LOOKING_SIDE"

    elif pitch > 20:
        return "LOOKING_DOWN"

    elif pitch < -20:
        return "LOOKING_UP"

    return "NEUTRAL"