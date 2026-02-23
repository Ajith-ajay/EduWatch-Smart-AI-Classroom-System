CREATE OR REPLACE VIEW view_monthly_teacher_report AS
SELECT
    sch.full_name AS teacher_name,
    COUNT(*) FILTER (WHERE a.status = 'PRESENT') AS total_present,
    COUNT(*) FILTER (WHERE a.status = 'WRONG_TEACHER') AS total_wrong_assignments,
    COUNT(*) FILTER (WHERE a.status = 'SUBSTITUTE') AS total_substitutions,
    COUNT(*) AS total_periods
FROM attendance_log a
JOIN teachers sch ON a.scheduled_teacher_id = sch.teacher_id
WHERE DATE_TRUNC('month', a.attendance_date) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY sch.full_name;