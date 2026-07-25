-- Run migrations
\i migrations/001_create_teachers.sql
\i migrations/002_create_subjects.sql
\i migrations/003_create_classes.sql
\i migrations/004_create_timetable.sql
\i migrations/005_create_substitution.sql
\i migrations/006_create_attendance_log.sql
\i migrations/007_create_user.sql
\i migrations/008_constraints_and_indexes.sql

-- Run seeds
\i seeds/seed_teachers.sql
\i seeds/seed_subjects.sql
\i seeds/seed_classes.sql
\i seeds/seed_timetable.sql

-- Run functions
\i functions/get_current_period.sql
\i functions/check_substitution.sql
\i functions/mark_attendance.sql

-- Run views
\i views/view_today_schedule.sql
\i views/view_attendance_summary.sql
\i views/view_wrong_teacher_logs.sql
\i views/view_monthly_teacher_report.sql
\i views/view_live_current_period.sql