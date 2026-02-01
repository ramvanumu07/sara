-- ========================================
-- Migration Script: Convert chat_history to chat_sessions
-- ========================================
-- Run this BEFORE running chat-sessions-schema.sql to preserve existing data

-- First, create the new table alongside the old one
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  phase VARCHAR(50) DEFAULT 'session',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id, subtopic_id)
);

-- Create indexes
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_user_topic ON chat_sessions(user_id, topic_id, subtopic_id);
CREATE INDEX idx_chat_sessions_phase ON chat_sessions(phase);
CREATE INDEX idx_chat_sessions_messages ON chat_sessions USING GIN (messages);

-- Add trigger for auto-updating timestamp
CREATE TRIGGER chat_sessions_updated 
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ========================================
-- Data Migration
-- ========================================
-- Convert existing chat_history records to chat_sessions format
INSERT INTO chat_sessions (user_id, topic_id, subtopic_id, messages, phase, created_at, updated_at)
SELECT 
  user_id,
  topic_id,
  subtopic_id,
  jsonb_agg(
    jsonb_build_object(
      'role', role,
      'content', content,
      'timestamp', created_at,
      'phase', COALESCE(phase, 'session')
    ) ORDER BY created_at
  ) as messages,
  COALESCE(MAX(phase), 'session') as phase,
  MIN(created_at) as created_at,
  MAX(created_at) as updated_at
FROM chat_history
GROUP BY user_id, topic_id, subtopic_id;

-- ========================================
-- Verification
-- ========================================
-- Check that migration worked correctly
SELECT 
  'Original chat_history' as source,
  COUNT(*) as message_count,
  COUNT(DISTINCT user_id || topic_id || subtopic_id) as unique_sessions
FROM chat_history
UNION ALL
SELECT 
  'New chat_sessions' as source,
  SUM(jsonb_array_length(messages)) as message_count,
  COUNT(*) as unique_sessions
FROM chat_sessions;

-- Show sample of migrated data
SELECT 
  user_id,
  topic_id,
  subtopic_id,
  jsonb_array_length(messages) as message_count,
  messages -> 0 ->> 'content' as first_message,
  messages -> -1 ->> 'content' as last_message
FROM chat_sessions
LIMIT 5;

-- ========================================
-- After verification, drop old table
-- ========================================
-- UNCOMMENT ONLY AFTER VERIFYING DATA IS CORRECT:
-- DROP TABLE chat_history;