from collections import deque
import time

import cv2

class TeachingActivityEngine:

    def __init__(self):

        self.speech_buffer = deque(maxlen=30)
        self.gesture_buffer = deque(maxlen=30)
        self.teacher_buffer = deque(maxlen=30)
        self.person_buffer = deque(maxlen=30)
        self.face_buffer = deque(maxlen=30)
        self.head_pose_buffer = deque(maxlen=30)

        self.active_start_time = None
        self.confirmed_teaching = False

        self.last_update = time.time()

    def update(self, teacher, gesture, speech, person, facing_forward, head_state):

        self.teacher_buffer.append(int(teacher))
        self.gesture_buffer.append(int(gesture))
        self.speech_buffer.append(int(speech))
        self.person_buffer.append(int(person))
        self.face_buffer.append(int(facing_forward))

        pose_score = 0

        if head_state == "LOOKING_AT_CLASS":
            pose_score = 1.0

        elif head_state == "LOOKING_SIDE":
            pose_score = 0.8   # writing on board

        elif head_state == "LOOKING_DOWN":
            pose_score = 0.3   # reading laptop

        else:
            pose_score = 0.5
        self.head_pose_buffer.append(int(pose_score))

        face_score = sum(self.face_buffer)/len(self.face_buffer)
        teacher_score = sum(self.teacher_buffer)/len(self.teacher_buffer)
        gesture_score = sum(self.gesture_buffer)/len(self.gesture_buffer)
        speech_score = sum(self.speech_buffer)/len(self.speech_buffer)
        person_score = sum(self.person_buffer)/len(self.person_buffer)
        head_pose_score = sum(self.head_pose_buffer)/len(self.head_pose_buffer)

        # New weights suitable for back-facing camera
        teaching_score = (
            0.30 * speech_score +
            0.30 * gesture_score +
            0.25 * person_score +   # Heavily rely on person being in the teacher zone
            0.10 * teacher_score +  # Subsidized by cache mechanism
            0.05 * head_pose_score  # De-emphasize head pose since back of head is common
        )

        # Baseline checks
        if person_score < 0.2:
            status = "INACTIVE (NO TEACHER)"
        elif speech_score < 0.2 and gesture_score < 0.2:
            status = "INACTIVE TEACHING"
        else:
            status = "TEACHING ACTIVE"

        # If they are facing board but gesturing and present, they are teaching
        if person_score > 0.5 and (gesture_score > 0.4 or speech_score > 0.4):
            status = "TEACHING ACTIVE"

        if teaching_score > 0.60 or status == "TEACHING ACTIVE":
            if self.active_start_time is None:
                self.active_start_time = time.time()
            elif time.time() - self.active_start_time > 8:     # Confirm after 8 secs
                self.confirmed_teaching = True
        else:
            self.active_start_time = None
            self.confirmed_teaching = False

        if self.confirmed_teaching:
            return teaching_score, status if status == "TEACHING ACTIVE" else "TEACHING ACTIVE", (0,255,0)
        elif teaching_score > 0.35:
            return teaching_score, "LIKELY TEACHING", (0,255,255)
        else:
            return teaching_score, status, (0,0,255)