CREATE OR REPLACE FUNCTION mark_attendance(
    p_class_id INTEGER,
    p_subject_id INTEGER,
    p_timetable_id INTEGER,
    p_scheduled_teacher INTEGER,
    p_detected_teacher INTEGER,
    p_status VARCHAR,
    p_confidence NUMERIC
)
RETURNS VOID AS $$
BEGIN

    INSERT INTO attendance_log (
        class_id,
        subject_id,
        timetable_id,
        scheduled_teacher_id,
        detected_teacher_id,
        attendance_date,
        period_start,
        period_end,
        status,
        confidence_score,
        locked
    )
    SELECT
        p_class_id,
        p_subject_id,
        p_timetable_id,
        p_scheduled_teacher,
        p_detected_teacher,
        CURRENT_DATE,
        start_time,
        end_time,
        p_status,
        p_confidence,
        TRUE
    FROM timetable
    WHERE timetable_id = p_timetable_id
    ON CONFLICT (timetable_id, attendance_date) DO NOTHING;

END;
$$ LANGUAGE plpgsql;