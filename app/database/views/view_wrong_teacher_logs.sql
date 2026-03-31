CREATE OR REPLACE VIEW view_wrong_teacher_logs AS
SELECT
    a.attendance_date,
    c.class_name,
    s.subject_name,
    sch.full_name AS scheduled_teacher,
    det.full_name AS detected_teacher,
    a.confidence_score,
    a.created_at
FROM attendance_log a
JOIN classes c ON a.class_id = c.class_id
JOIN subjects s ON a.subject_id = s.subject_id
JOIN teachers sch ON a.scheduled_teacher_id = sch.teacher_id
JOIN teachers det ON a.detected_teacher_id = det.teacher_id
WHERE a.status = 'WRONG_TEACHER';