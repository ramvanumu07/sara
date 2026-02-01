-- Sara Learning Platform Database Schema
-- Updated for flattened curriculum structure (no subtopics)
-- Industry-level database design with proper constraints, indexes, and RLS

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ USERS TABLE ============
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ PROGRESS TABLE ============
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'not_started',
  phase VARCHAR(50) DEFAULT 'session',
  current_task INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- ============ CHAT HISTORY TABLE ============
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  messages TEXT NOT NULL,
  phase VARCHAR(50) DEFAULT 'session',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- ============ PASSWORD RESET TOKENS TABLE ============
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ USER SESSIONS TABLE ============
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL, -- Changed from VARCHAR(255) to TEXT for longer JWT tokens
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ LEARNING ANALYTICS TABLE ============
CREATE TABLE learning_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'session_start', 'phase_complete', 'topic_complete', etc.
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ INDEXES ============
CREATE INDEX idx_progress_user_topic ON progress(user_id, topic_id);
CREATE INDEX idx_chat_user_topic ON chat_history(user_id, topic_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_learning_analytics_user ON learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_topic ON learning_analytics(topic_id);
CREATE INDEX idx_learning_analytics_event ON learning_analytics(event_type);

-- ============ TRIGGERS ============
-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_history_updated_at BEFORE UPDATE ON chat_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============ ROW LEVEL SECURITY (RLS) ============
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY users_own_data ON users FOR ALL USING (id = current_setting('app.current_user_id')::uuid);
CREATE POLICY progress_own_data ON progress FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);
CREATE POLICY chat_history_own_data ON chat_history FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);
CREATE POLICY password_reset_own_data ON password_reset_tokens FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);
CREATE POLICY user_sessions_own_data ON user_sessions FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);
CREATE POLICY learning_analytics_own_data ON learning_analytics FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);

-- ============ SAMPLE DATA (Optional) ============
-- Create admin user (password: admin123)
-- INSERT INTO users (name, username, email, password_hash, role) 
-- VALUES ('Admin User', 'admin', 'admin@sara.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsYhsqnma', 'admin');

-- ============ COMMENTS ============
COMMENT ON TABLE users IS 'User accounts with authentication data';
COMMENT ON TABLE progress IS 'User learning progress per topic (flattened structure)';
COMMENT ON TABLE chat_history IS 'Chat conversation history per topic';
COMMENT ON TABLE password_reset_tokens IS 'Password reset tokens with expiration';
COMMENT ON TABLE user_sessions IS 'Active user sessions with JWT tokens';
COMMENT ON TABLE learning_analytics IS 'Learning analytics and event tracking';

COMMENT ON COLUMN progress.topic_id IS 'Topic identifier from curriculum (no subtopics)';
COMMENT ON COLUMN chat_history.topic_id IS 'Topic identifier from curriculum (no subtopics)';
COMMENT ON COLUMN user_sessions.token IS 'JWT token (TEXT type for longer tokens)';