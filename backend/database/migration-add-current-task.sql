-- Migration: Add current_task column and update phase values
-- Run this in Supabase SQL Editor if you already have the progress table

-- Add the current_task column
ALTER TABLE progress ADD COLUMN IF NOT EXISTS current_task INTEGER DEFAULT 0;

-- Update old 'learning' phase to new 'session' phase
UPDATE progress SET phase = 'session' WHERE phase = 'learning';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'progress';


















