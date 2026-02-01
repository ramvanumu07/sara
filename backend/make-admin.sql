-- Make your current user (256K5A0523) an admin
INSERT INTO admins (user_id) 
SELECT id FROM users WHERE student_id = '256K5A0523';

-- Verify admin was created
SELECT u.student_id, u.name, a.id as admin_id 
FROM users u 
LEFT JOIN admins a ON u.id = a.user_id 
WHERE u.student_id = '256K5A0523';