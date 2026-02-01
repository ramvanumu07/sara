-- Add the default admin user
INSERT INTO users (student_id, password, name, has_access) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', TRUE);

-- Make the admin user an actual admin
INSERT INTO admins (user_id) 
SELECT id FROM users WHERE student_id = 'admin';

-- Verify both users exist
SELECT u.student_id, u.name, u.has_access, 
       CASE WHEN a.id IS NOT NULL THEN 'Yes' ELSE 'No' END as is_admin
FROM users u 
LEFT JOIN admins a ON u.id = a.user_id;