-- Migration: Add columns for improved learning experience
-- Run this migration on your Supabase database

-- Add saved_code column for code persistence
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS saved_code TEXT DEFAULT '';

-- Add hints_used column for tracking hint usage
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS hints_used INTEGER DEFAULT 0;

-- Add execution_result column for storing code execution results
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS execution_result TEXT DEFAULT '';

-- Add submitted_code column if not exists
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS submitted_code TEXT DEFAULT '';

-- Add concept_revealed column if not exists
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS concept_revealed BOOLEAN DEFAULT false;

-- Add phase column if not exists
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS phase VARCHAR(50) DEFAULT 'session';

-- Create index on phase for faster queries
CREATE INDEX IF NOT EXISTS idx_progress_phase ON progress(phase);

-- Create index on user_id + status for dashboard queries
CREATE INDEX IF NOT EXISTS idx_progress_user_status ON progress(user_id, status);








