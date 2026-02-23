-- Constraints and Indexes for Teachers Table
CREATE INDEX IF NOT EXISTS idx_teacher_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_teacher_active ON teachers(is_active);

-- Constraints and Indexes for timetable Table
CREATE INDEX IF NOT EXISTS idx_timetable_day_time 
ON timetable(day_of_week, start_time, end_time);

-- Constraints and Indexes for teacher_substitution Table
CREATE INDEX IF NOT EXISTS idx_substitution_date 
ON teacher_substitution(substitution_date);

-- Constraints and Indexes for attendance_log Table
ALTER TABLE attendance_log
ADD CONSTRAINT chk_status
CHECK (status IN (
    'PRESENT',
    'WRONG_TEACHER',
    'SUBSTITUTE',
    'NOT_DETECTED'
));

ALTER TABLE attendance_log
ADD CONSTRAINT unique_attendance_per_period
UNIQUE (timetable_id, attendance_date);