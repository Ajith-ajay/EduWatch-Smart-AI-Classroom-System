-- INSERT INTO teachers (full_name, email, department, face_encoding_path)
-- VALUES
-- ('Ajith G', 'ajith@college.edu', 'CSE', 'teacher_encodings.pkl'),
-- ('Akash A', 'akash@college.edu', 'CSE', 'teacher_encodings.pkl'),
-- ('Aashik Basha A', 'aashik@college.edu', 'CSE', 'teacher_encodings.pkl');

INSERT INTO "Teacher" (
    "full_name",
    "email",
    "department",
    "subject",
    "phone",
    "qualification",
    "staff_image_path",
    "face_encoding_path",
    "voice_encoding_path",
    "is_active",
    "updated_at"
)
VALUES
(
    'Dr. Ananya Sharma',
    'ananya.sharma@eduwatch.edu',
    'Computer Science',
    'Artificial Intelligence',
    '+91-9876543210',
    'PhD in Computer Science',
    '/uploads/staff/ananya.jpg',
    '/encodings/faces/ananya.npy',
    '/encodings/voices/ananya.pkl',
    true,
    CURRENT_TIMESTAMP
),
(
    'Rahul Verma',
    'rahul.verma@eduwatch.edu',
    'Electronics',
    'Digital Signal Processing',
    '+91-9123456780',
    'M.Tech in Electronics',
    '/uploads/staff/rahul.jpg',
    '/encodings/faces/rahul.npy',
    '/encodings/voices/rahul.pkl',
    true,
    CURRENT_TIMESTAMP
),
(
    'Priya Nair',
    'priya.nair@eduwatch.edu',
    'Mathematics',
    'Linear Algebra',
    '+91-9988776655',
    'MSc in Mathematics',
    '/uploads/staff/priya.jpg',
    '/encodings/faces/priya.npy',
    NULL,
    true,
    CURRENT_TIMESTAMP
),
(
    'Arjun Mehta',
    'arjun.mehta@eduwatch.edu',
    'Physics',
    'Quantum Mechanics',
    '+91-9870011223',
    'PhD in Physics',
    '/uploads/staff/arjun.jpg',
    '/encodings/faces/arjun.npy',
    '/encodings/voices/arjun.pkl',
    false,
    CURRENT_TIMESTAMP
);