CREATE OR REPLACE VIEW view_today_schedule AS
SELECT 
    t.timetable_id,

    -- IDs (REQUIRED)
    t.class_id,
    t.subject_id,
    t.teacher_id,

    -- Names (for display)
    c.class_name,
    s.subject_name,

    t.day_of_week,
    t.start_time,
    t.end_time,

    sch.full_name AS scheduled_teacher,

    -- Effective teacher logic
    COALESCE(sub.teacher_id, sch.teacher_id) AS effective_teacher_id,
    COALESCE(sub.full_name, sch.full_name) AS effective_teacher,

    sub.teacher_id AS substitute_teacher_id,
    sub.full_name AS substitute_teacher

FROM timetable t
JOIN classes c ON t.class_id = c.class_id
JOIN subjects s ON t.subject_id = s.subject_id
JOIN teachers sch ON t.teacher_id = sch.teacher_id
LEFT JOIN teacher_substitution ts
    ON ts.timetable_id = t.timetable_id
    AND ts.substitution_date = CURRENT_DATE
LEFT JOIN teachers sub ON ts.substitute_teacher_id = sub.teacher_id
WHERE t.day_of_week = TRIM(TO_CHAR(CURRENT_DATE, 'Day'))
AND t.is_active = TRUE;