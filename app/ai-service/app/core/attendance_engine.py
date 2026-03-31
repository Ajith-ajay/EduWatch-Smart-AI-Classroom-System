from core.period_service import get_current_period
from core.db_connection import execute_query
from core.decision_engine import decide_status
from core.lock_manager import LockManager

lock_manager = LockManager(confirm_duration=1)     # 60 seconds confirmation duration

marked_periods = set()

current_period_id = None
attendance_marked = False

def process_attendance(detected_teacher_id, confidence_score):
    if detected_teacher_id is None:
        print("No teacher detected, skipping attendance processing.")
        return

    global current_period_id
    global attendance_marked

    period = get_current_period()

    if not period:
        print("No active period")
        current_period_id = None
        attendance_marked = False
        lock_manager.reset()
        return

    timetable_id = period["timetable_id"]
    class_id = period["class_name"]
    subject_name = period["subject_name"]

    scheduled_teacher_id = period["teacher_id"]
    substitute_teacher_id = period["substitute_teacher_id"]
    effective_teacher_id = period["effective_teacher_id"]

    # 🚫 Already marked? Skip
    if timetable_id in marked_periods:
        return
    # 🔁 PERIOD CHANGE DETECTION
    if timetable_id != current_period_id:

        print("🔄 New period detected")

        current_period_id = timetable_id
        attendance_marked = False
        lock_manager.reset()

    status = decide_status(
        scheduled_teacher_id,
        detected_teacher_id,
        substitute_teacher_id
    )

    confirm_condition = status in ["PRESENT", "SUBSTITUTE"]

    locked = lock_manager.update(confirm_condition)

    # 🚫 If already marked and no teacher change, skip
    if attendance_marked and status in ["PRESENT", "SUBSTITUTE"]:
        print("Attendance already marked for this period, skipping.")
        return

    if locked:
        insert_query = """
            SELECT mark_attendance(
                %s, %s, %s,
                %s, %s,
                %s, %s
            );
        """

        execute_query(insert_query, (
            period["class_id"],
            period["subject_id"],
            timetable_id,
            scheduled_teacher_id,
            detected_teacher_id,
            status,
            confidence_score
        ))

        marked_periods.add(timetable_id)  # 🔥 Prevent future inserts

        attendance_marked = True

        print("Attendance Marked:", status)