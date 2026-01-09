-- EduBridge Database Schema V2
-- 4-Phase Learning System: Session → PlayTime → Assignment → Feedback
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== USERS ==========
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  has_access BOOLEAN DEFAULT FALSE,
  access_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== ADMINS ==========
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== LEARNING SESSIONS (Main Progress Tracker) ==========
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  
  -- Current phase: 'session', 'playtime', 'assignment', 'feedback'
  current_phase VARCHAR(50) DEFAULT 'session',
  
  -- Session phase tracking
  concept_revealed BOOLEAN DEFAULT FALSE,
  
  -- Assignment tracking
  current_assignment INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  
  -- Overall status
  status VARCHAR(50) DEFAULT 'in_progress',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id, subtopic_id)
);

-- ========== CHAT HISTORY (For Session & PlayTime AI) ==========
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  phase VARCHAR(50) NOT NULL, -- 'session' or 'playtime'
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== TERMINAL HISTORY (PlayTime Terminal Commands) ==========
CREATE TABLE IF NOT EXISTS terminal_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  command TEXT NOT NULL,
  output TEXT,
  is_error BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== ASSIGNMENTS ==========
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  assignment_index INTEGER NOT NULL,
  
  -- Assignment content
  title TEXT NOT NULL,
  description TEXT,
  
  -- User's submission
  submitted_code TEXT,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  time_taken_seconds INTEGER,
  
  -- Status: 'pending', 'in_progress', 'submitted', 'reviewed'
  status VARCHAR(50) DEFAULT 'pending',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id, subtopic_id, assignment_index)
);

-- ========== ASSIGNMENT FEEDBACK ==========
CREATE TABLE IF NOT EXISTS assignment_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE UNIQUE,
  
  -- Test results
  total_test_cases INTEGER DEFAULT 0,
  passed_test_cases INTEGER DEFAULT 0,
  failed_tests JSONB DEFAULT '[]', -- Array of {name, expected, actual, message}
  
  -- Code quality checklist
  code_readability BOOLEAN,
  uses_const_over_let BOOLEAN,
  meaningful_names BOOLEAN,
  no_redundant_code BOOLEAN,
  proper_indentation BOOLEAN,
  follows_conventions BOOLEAN,
  optimal_solution BOOLEAN,
  
  -- AI review
  ai_review TEXT,
  suggestions JSONB DEFAULT '[]', -- Array of improvement suggestions
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== PLAYGROUND CODE (Saved code from PlayTime) ==========
CREATE TABLE IF NOT EXISTS playground_code (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  code TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id, subtopic_id)
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_user_topic ON chat_history(user_id, topic_id, subtopic_id);
CREATE INDEX IF NOT EXISTS idx_terminal_user_topic ON terminal_history(user_id, topic_id, subtopic_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user_topic ON assignments(user_id, topic_id, subtopic_id);

-- ========== AUTO UPDATE TIMESTAMP ==========
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then recreate
DROP TRIGGER IF EXISTS users_updated ON users;
DROP TRIGGER IF EXISTS learning_sessions_updated ON learning_sessions;
DROP TRIGGER IF EXISTS assignments_updated ON assignments;
DROP TRIGGER IF EXISTS playground_code_updated ON playground_code;

CREATE TRIGGER users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER learning_sessions_updated BEFORE UPDATE ON learning_sessions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER assignments_updated BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER playground_code_updated BEFORE UPDATE ON playground_code
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ========== MIGRATION FROM V1 ==========
-- If you have existing data, run this to migrate:
-- 
-- INSERT INTO learning_sessions (user_id, topic_id, subtopic_id, current_phase, status, started_at, completed_at)
-- SELECT user_id, topic_id, subtopic_id, 
--        CASE WHEN status = 'completed' THEN 'feedback' ELSE phase END,
--        status, started_at, completed_at
-- FROM progress
-- ON CONFLICT (user_id, topic_id, subtopic_id) DO NOTHING;













