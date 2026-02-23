CREATE TABLE IF NOT EXISTS teacher_substitution (
    substitution_id SERIAL PRIMARY KEY,
    timetable_id INTEGER NOT NULL,
    original_teacher_id INTEGER NOT NULL,
    substitute_teacher_id INTEGER NOT NULL,
    substitution_date DATE NOT NULL,
    approved_by VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_timetable_sub
        FOREIGN KEY(timetable_id)
        REFERENCES timetable(timetable_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_original_teacher
        FOREIGN KEY(original_teacher_id)
        REFERENCES teachers(teacher_id),

    CONSTRAINT fk_substitute_teacher
        FOREIGN KEY(substitute_teacher_id)
        REFERENCES teachers(teacher_id)
);