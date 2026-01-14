-- Migration for 4-Phase Learning System
-- Run this in Supabase SQL Editor to add new columns

-- Add new columns to progress table for 4-phase system
ALTER TABLE progress ADD COLUMN IF NOT EXISTS concept_revealed BOOLEAN DEFAULT FALSE;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS total_tasks INTEGER DEFAULT 0;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS submitted_code TEXT;

-- Update existing phase values
UPDATE progress SET phase = 'session' WHERE phase IS NULL OR phase = '';
UPDATE progress SET phase = 'session' WHERE phase = 'learning';

-- Make sure phase column exists and has a default
ALTER TABLE progress ALTER COLUMN phase SET DEFAULT 'session';














