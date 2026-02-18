-- Store username instead of user_id in user_course_unlocks (minimal change).
-- Run in Supabase SQL Editor after 003.

-- Add username column
ALTER TABLE user_course_unlocks
  ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- Backfill from users
UPDATE user_course_unlocks u
SET username = (SELECT us.username FROM users us WHERE us.id = u.user_id)
WHERE u.user_id IS NOT NULL;

-- Drop old constraint and column
ALTER TABLE user_course_unlocks DROP CONSTRAINT IF EXISTS user_course_unlocks_user_id_course_id_key;
ALTER TABLE user_course_unlocks DROP CONSTRAINT IF EXISTS user_course_unlocks_user_id_fkey;
ALTER TABLE user_course_unlocks DROP COLUMN IF EXISTS user_id;

-- Unique (allows multiple NULL username = unused slots) and index on username
ALTER TABLE user_course_unlocks
  ADD CONSTRAINT user_course_unlocks_username_course_id_key UNIQUE (username, course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_unlocks_username ON user_course_unlocks(username);

COMMENT ON COLUMN user_course_unlocks.username IS 'NULL = unused slot; set to redeemer username when code is used.';
