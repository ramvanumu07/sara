-- Course-level unlock: user can unlock a course for lifetime after payment
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_course_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_user_course_unlocks_user_id ON user_course_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_unlocks_course_id ON user_course_unlocks(course_id);

COMMENT ON TABLE user_course_unlocks IS 'Tracks which courses a user has unlocked (e.g. after payment). Access is per-course; no account-level lock.';
