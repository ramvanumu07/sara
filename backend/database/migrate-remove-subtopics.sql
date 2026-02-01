-- Migration: Remove subtopic references from database
-- This migration updates the database schema to match the new flattened curriculum structure

-- Step 1: Drop existing constraints that reference subtopic_id
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_id_topic_id_subtopic_id_key;
ALTER TABLE chat_history DROP CONSTRAINT IF EXISTS chat_history_user_id_topic_id_subtopic_id_key;

-- Step 2: Remove subtopic_id columns
ALTER TABLE progress DROP COLUMN IF EXISTS subtopic_id;
ALTER TABLE chat_history DROP COLUMN IF EXISTS subtopic_id;

-- Step 3: Add new unique constraints without subtopic_id
ALTER TABLE progress ADD CONSTRAINT progress_user_topic_unique UNIQUE(user_id, topic_id);
ALTER TABLE chat_history ADD CONSTRAINT chat_history_user_topic_unique UNIQUE(user_id, topic_id);

-- Step 4: Update indexes
DROP INDEX IF EXISTS idx_progress_user_topic;
DROP INDEX IF EXISTS idx_chat_user_topic;

CREATE INDEX idx_progress_user_topic ON progress(user_id, topic_id);
CREATE INDEX idx_chat_user_topic ON chat_history(user_id, topic_id);

-- Step 5: Clean up any duplicate records that might exist after removing subtopic_id
-- Keep only the most recent record for each user_id, topic_id combination
WITH ranked_progress AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY user_id, topic_id ORDER BY updated_at DESC) as rn
  FROM progress
)
DELETE FROM progress 
WHERE id IN (
  SELECT id FROM ranked_progress WHERE rn > 1
);

WITH ranked_chat AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY user_id, topic_id ORDER BY updated_at DESC) as rn
  FROM chat_history
)
DELETE FROM chat_history 
WHERE id IN (
  SELECT id FROM ranked_chat WHERE rn > 1
);

-- Step 6: Update any remaining references in other tables if they exist
-- (This is a safety measure in case there are other tables we missed)

COMMENT ON TABLE progress IS 'Updated schema - removed subtopic_id for flattened curriculum structure';
COMMENT ON TABLE chat_history IS 'Updated schema - removed subtopic_id for flattened curriculum structure';