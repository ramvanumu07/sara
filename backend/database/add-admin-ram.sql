-- Add RamVanumu (your user) as admin. Run in Supabase SQL Editor.
-- Your user_id: 43bd9c24-9bd4-4a76-bbc6-fe955c509168

INSERT INTO admins (user_id)
VALUES ('43bd9c24-9bd4-4a76-bbc6-fe955c509168'::uuid)
ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT a.id, a.user_id, u.username, u.email
FROM admins a
JOIN users u ON u.id = a.user_id
WHERE a.user_id = '43bd9c24-9bd4-4a76-bbc6-fe955c509168'::uuid;
