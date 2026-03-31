def decide_status(
        scheduled_teacher_id,
        detected_teacher_id,
        substitute_teacher_id=None):

    if detected_teacher_id is None:
        return "NOT_DETECTED"

    if substitute_teacher_id and detected_teacher_id == substitute_teacher_id:
        return "SUBSTITUTE"

    if detected_teacher_id == scheduled_teacher_id:
        return "PRESENT"

    return "WRONG_TEACHER"