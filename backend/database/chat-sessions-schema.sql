-- ========================================
-- EduBridge Chat Sessions Schema Update
-- ========================================
-- New efficient schema: One row per chat session instead of one row per message

-- Drop the old chat_history table (WARNING: This will delete existing chat data)
-- If you want to preserve data, run the migration script first
DROP TABLE IF EXISTS chat_history;

-- Create new chat_sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',  -- Array of message objects
  phase VARCHAR(50) DEFAULT 'session',   -- Current learning phase
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id, subtopic_id)
);

-- Create indexes for performance
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_user_topic ON chat_sessions(user_id, topic_id, subtopic_id);
CREATE INDEX idx_chat_sessions_phase ON chat_sessions(phase);
CREATE INDEX idx_chat_sessions_messages ON chat_sessions USING GIN (messages);

-- Add trigger for auto-updating timestamp
CREATE TRIGGER chat_sessions_updated 
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ========================================
-- Message Structure Documentation
-- ========================================
-- Each message in the JSONB array has this structure:
-- {
--   "role": "user" | "assistant",
--   "content": "message text",
--   "timestamp": "2024-01-01T10:00:00Z",
--   "phase": "session" | "playtime" | "assignment" | "feedback"
-- }

-- Example usage:
-- INSERT INTO chat_sessions (user_id, topic_id, subtopic_id, messages) 
-- VALUES (
--   'user-uuid',
--   'foundation', 
--   'variables',
--   '[
--     {"role": "user", "content": "What are variables?", "timestamp": "2024-01-01T10:00:00Z", "phase": "session"},
--     {"role": "assistant", "content": "Variables are containers...", "timestamp": "2024-01-01T10:00:05Z", "phase": "session"}
--   ]'::jsonb
-- );

-- ========================================
-- Verification Query
-- ========================================
SELECT 
  'chat_sessions' as table_name, 
  count(*) as row_count,
  'Ready for efficient chat storage' as note
FROM chat_sessions;