-- Allow user_id to be NULL for pre-created unlock slots (admin-generated codes).
-- Run in Supabase SQL Editor after 002_user_course_unlocks.sql

ALTER TABLE user_course_unlocks
  ALTER COLUMN user_id DROP NOT NULL;

COMMENT ON COLUMN user_course_unlocks.user_id IS 'NULL = unused slot (code not yet redeemed); set when user redeems the code.';
