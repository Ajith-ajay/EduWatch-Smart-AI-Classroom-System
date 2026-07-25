CREATE TABLE IF NOT EXISTS timetable (
    timetable_id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_class
        FOREIGN KEY(class_id)
        REFERENCES classes(class_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_subject
        FOREIGN KEY(subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_teacher
        FOREIGN KEY(teacher_id)
        REFERENCES teachers(teacher_id)
        ON DELETE CASCADE
);