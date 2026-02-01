-- Add missing columns to progress table that the backend expects
ALTER TABLE progress ADD COLUMN IF NOT EXISTS concept_revealed BOOLEAN DEFAULT FALSE;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS current_outcome_index INTEGER DEFAULT 0;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS total_tasks INTEGER DEFAULT 0;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'progress' 
ORDER BY ordinal_position;