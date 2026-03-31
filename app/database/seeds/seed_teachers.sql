INSERT INTO teachers (
    "full_name",
    "email",
    "department",
    "phone",
    "qualification",
    "staff_image_path",
    "is_active",
    "updated_at"
)
VALUES
(
    'Dr. Ajith G',
    'ajith.g@eduwatch.edu',
    'Artificial Intelligence',
    '+91-9876543210',
    'PhD in Computer Science',
    '/uploads/staff/Ajith G.jpg',
    true,
    CURRENT_TIMESTAMP
),
(
    'Dr. Akash A',
    'akash.a@eduwatch.edu',
    'Digital Signal Processing',
    '+91-9123456780',
    'M.Tech in Electronics',
    '/uploads/staff/Akash A.jpeg',
    true,
    CURRENT_TIMESTAMP
),
(
    'Dr. Aashik Basha A',
    'aashik.basha@eduwatch.edu',
    'Mathematics',
    '+91-9988776655',
    'MSc in Mathematics',
    '/uploads/staff/Aashik Basha A.jpeg',
    true,
    CURRENT_TIMESTAMP
),
(
    'Dr. Samantha R',
    'samantha.r@eduwatch.edu',
    'Physics',
    '+91-9870011223',
    'PhD in Physics',
    '/uploads/staff/samantha.png',
    false,
    CURRENT_TIMESTAMP
);