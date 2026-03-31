CREATE TABLE IF NOT EXISTS attendance_log (
    attendance_id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    timetable_id INTEGER NOT NULL,

    scheduled_teacher_id INTEGER NOT NULL,
    detected_teacher_id INTEGER,

    attendance_date DATE NOT NULL,
    period_start TIME NOT NULL,
    period_end TIME NOT NULL,

    status VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5,2),

    locked BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_class_att
        FOREIGN KEY(class_id)
        REFERENCES classes(class_id),

    CONSTRAINT fk_subject_att
        FOREIGN KEY(subject_id)
        REFERENCES subjects(subject_id),

    CONSTRAINT fk_timetable_att
        FOREIGN KEY(timetable_id)
        REFERENCES timetable(timetable_id),

    CONSTRAINT fk_scheduled_teacher
        FOREIGN KEY(scheduled_teacher_id)
        REFERENCES teachers(teacher_id),

    CONSTRAINT fk_detected_teacher
        FOREIGN KEY(detected_teacher_id)
        REFERENCES teachers(teacher_id)
);