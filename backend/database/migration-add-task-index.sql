-- Migration: Add current_task_index to progress table
-- Run this in Supabase SQL Editor if you have existing data

-- Add the new column
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS current_task_index INTEGER DEFAULT 0;

-- Update phase from 'learning' to 'session' for consistency
UPDATE progress SET phase = 'session' WHERE phase = 'learning';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_progress_topic ON progress(topic_id, subtopic_id);

