-- ========================================
-- SARA Learning Platform - Updated Database Schema
-- ========================================
-- Run this in your Supabase SQL Editor to update the schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USERS TABLE (Updated for Sara)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  has_access BOOLEAN DEFAULT TRUE,
  access_expires_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ADMINS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PROGRESS TABLE (Single-Topic Architecture)
-- ========================================
DROP TABLE IF EXISTS progress CASCADE;
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'not_started',
  phase VARCHAR(50) DEFAULT 'session',
  current_task INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  completed_assignments INTEGER DEFAULT 0,
  session_completed BOOLEAN DEFAULT FALSE,
  playtime_started BOOLEAN DEFAULT FALSE,
  playtime_completed BOOLEAN DEFAULT FALSE,
  assignment_started BOOLEAN DEFAULT FALSE,
  topic_completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- ========================================
-- CHAT HISTORY TABLE (Single-Topic Architecture)
-- ========================================
DROP TABLE IF EXISTS chat_history CASCADE;
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  messages TEXT NOT NULL, -- Store as single string: "AGENT: ... USER: ..."
  message_count INTEGER DEFAULT 0,
  phase VARCHAR(50) DEFAULT 'session',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- ========================================
-- PASSWORD RESET TOKENS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- USER SESSIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- LEARNING ANALYTICS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS learning_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  session_date DATE NOT NULL,
  time_spent INTEGER DEFAULT 0, -- in seconds
  messages_sent INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id, session_date)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_topic ON progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON progress(status);
CREATE INDEX IF NOT EXISTS idx_progress_updated ON progress(updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_user_topic ON chat_history(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_chat_updated ON chat_history(updated_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON learning_analytics(user_id, session_date);

-- ========================================
-- AUTO UPDATE TIMESTAMP FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGERS FOR AUTO TIMESTAMPS
-- ========================================
DROP TRIGGER IF EXISTS users_updated ON users;
CREATE TRIGGER users_updated 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS progress_updated ON progress;
CREATE TRIGGER progress_updated 
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS chat_history_updated ON chat_history;
CREATE TRIGGER chat_history_updated 
  BEFORE UPDATE ON chat_history
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS analytics_updated ON learning_analytics;
CREATE TRIGGER analytics_updated 
  BEFORE UPDATE ON learning_analytics
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ========================================
-- CLEAN UP OLD TABLES (if they exist)
-- ========================================
DROP TABLE IF EXISTS chat_sessions CASCADE;

-- ========================================
-- VERIFICATION QUERY
-- ========================================
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'admins', 'progress', 'chat_history', 'password_reset_tokens', 'user_sessions', 'learning_analytics')
ORDER BY tablename;

-- ========================================
-- SCHEMA UPDATE COMPLETE
-- ========================================
-- Your Sara database schema is now updated!
-- - Single-topic architecture
-- - Proper progress tracking
-- - No fallback data sources
-- - Comprehensive analytics support