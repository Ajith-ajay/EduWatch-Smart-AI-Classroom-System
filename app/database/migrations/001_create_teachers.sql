CREATE TABLE IF NOT EXISTS teachers (
    teacher_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100),
    -- subject VARCHAR(100),
    phone VARCHAR(20),
    qualification VARCHAR(50),
    staff_image_path TEXT, -- image file path
    face_encoding_path TEXT NOT NULL,
    voice_encoding_path TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);