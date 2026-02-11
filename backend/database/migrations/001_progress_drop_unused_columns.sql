-- Progress table: drop columns not used by the app.
-- Keep: id, user_id, topic_id, status, phase, current_task, total_tasks, assignments_completed, created_at, updated_at
-- current_task is 1-based (next task to do = assignments_completed + 1). When total_tasks=0, current_task must be 0 (constraint).

-- Run in Supabase SQL editor or: psql -f 001_progress_drop_unused_columns.sql

ALTER TABLE public.progress
  DROP COLUMN IF EXISTS hints_used,
  DROP COLUMN IF EXISTS concept_revealed,
  DROP COLUMN IF EXISTS saved_code,
  DROP COLUMN IF EXISTS current_outcome_index,
  DROP COLUMN IF EXISTS started_at,
  DROP COLUMN IF EXISTS completed_at,
  DROP COLUMN IF EXISTS last_accessed;
