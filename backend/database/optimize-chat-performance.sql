-- Chat Performance Optimization Script
-- Run this in your Supabase SQL editor to optimize chat history queries
-- This script is safe to run multiple times

BEGIN;

-- 1. Create composite index for faster chat_sessions lookups
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_topic 
ON chat_sessions(user_id, topic_id);

-- 2. Create index for timestamp-based queries
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message 
ON chat_sessions(user_id, last_message_at DESC);

-- 3. Create index for phase-based queries
CREATE INDEX IF NOT EXISTS idx_chat_sessions_phase 
ON chat_sessions(user_id, topic_id, phase);

-- 4. Create index for updated_at column (for cleanup and maintenance)
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at 
ON chat_sessions(updated_at DESC);

-- 5. Add constraint to prevent duplicate sessions (safe method)
DO $$ 
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_user_topic' 
        AND table_name = 'chat_sessions'
    ) THEN
        -- Add the constraint
        ALTER TABLE chat_sessions 
        ADD CONSTRAINT unique_user_topic 
        UNIQUE(user_id, topic_id);
        
        RAISE NOTICE 'Constraint unique_user_topic added successfully';
    ELSE
        RAISE NOTICE 'Constraint unique_user_topic already exists, skipping';
    END IF;
END $$;

-- 6. Optimize table storage (analyze for statistics)
-- Note: VACUUM might not be available in managed databases like Supabase
ANALYZE chat_sessions;

-- 7. Create function for efficient chat history retrieval
CREATE OR REPLACE FUNCTION get_chat_history_optimized(
  p_user_id UUID,
  p_topic_id TEXT
)
RETURNS TABLE(
  messages TEXT,
  message_count INTEGER,
  phase TEXT,
  last_message_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cs.messages,
    cs.message_count,
    cs.phase,
    cs.last_message_at
  FROM chat_sessions cs
  WHERE cs.user_id = p_user_id 
    AND cs.topic_id = p_topic_id;
END;
$$;

-- 8. Create performance monitoring view
CREATE OR REPLACE VIEW chat_performance_stats AS
SELECT 
  COUNT(*) as total_sessions,
  AVG(message_count) as avg_messages_per_session,
  MAX(message_count) as max_messages_per_session,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT topic_id) as unique_topics,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_session_duration_seconds
FROM chat_sessions
WHERE updated_at > NOW() - INTERVAL '7 days';

-- 9. Create cleanup function for old sessions (optional)
CREATE OR REPLACE FUNCTION cleanup_old_chat_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete sessions older than 90 days with no recent activity
  DELETE FROM chat_sessions 
  WHERE updated_at < NOW() - INTERVAL '90 days'
    AND message_count < 5; -- Only cleanup short conversations
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

COMMIT;

-- Performance optimization complete!
-- Run EXPLAIN ANALYZE on your queries to verify performance improvements

-- Test the optimization with this query:
-- EXPLAIN ANALYZE SELECT messages, message_count FROM chat_sessions 
-- WHERE user_id = 'your-user-id' AND topic_id = 'your-topic-id';