CREATE OR REPLACE FUNCTION get_current_period()
RETURNS TABLE (
    timetable_id INTEGER,
    class_id INTEGER,
    subject_id INTEGER,
    teacher_id INTEGER,
    start_time TIME,
    end_time TIME
)
AS $$
BEGIN
    RETURN QUERY
    SELECT t.timetable_id,
           t.class_id,
           t.subject_id,
           t.teacher_id,
           t.start_time,
           t.end_time
    FROM timetable t
    WHERE t.day_of_week = TO_CHAR(CURRENT_DATE, 'Day')
    AND CURRENT_TIME BETWEEN t.start_time AND t.end_time
    AND t.is_active = TRUE;
END;
$$ LANGUAGE plpgsql;