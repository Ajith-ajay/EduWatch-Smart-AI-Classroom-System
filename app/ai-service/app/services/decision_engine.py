def decide(teacher_detected, person_detected, gesture_detected, voice_detected):

    if teacher_detected and gesture_detected and voice_detected and person_detected:

        return "TEACHING ACTIVE", (0,255,0)

    elif teacher_detected and (gesture_detected or voice_detected) and person_detected:

        return "TEACHER PRESENT", (0,255,255)

    else:

        return "NO TEACHER", (0,0,255)
