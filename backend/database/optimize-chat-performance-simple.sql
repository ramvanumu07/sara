-- Chat Performance Optimization Script (Simplified for Supabase)
-- Run this in your Supabase SQL editor to optimize chat history queries
-- This script is safe to run multiple times

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

-- 5. Update table statistics for better query planning
ANALYZE chat_sessions;

-- 6. Create optimized function for chat history retrieval
CREATE OR REPLACE FUNCTION get_chat_history_fast(
  p_user_id UUID,
  p_topic_id TEXT
)
RETURNS TABLE(
  messages TEXT,
  message_count INTEGER,
  phase TEXT,
  last_message_at TIMESTAMPTZ
) 
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    cs.messages,
    cs.message_count,
    cs.phase,
    cs.last_message_at
  FROM chat_sessions cs
  WHERE cs.user_id = p_user_id 
    AND cs.topic_id = p_topic_id;
$$;

-- 7. Create performance monitoring view
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

-- Performance optimization complete!
-- The indexes will significantly improve query performance for chat history retrieval