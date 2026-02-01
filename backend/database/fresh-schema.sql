-- ========================================
-- EduBridge Fresh Database Schema
-- ========================================
-- Run this in your Supabase SQL Editor after deleting all existing tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  has_access BOOLEAN DEFAULT FALSE,
  access_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ADMINS TABLE
-- ========================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PROGRESS TABLE
-- ========================================
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'not_started',
  phase VARCHAR(50) DEFAULT 'session',
  current_task INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id, subtopic_id)
);

-- ========================================
-- CHAT HISTORY TABLE
-- ========================================
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  phase VARCHAR(50) DEFAULT 'session',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_user_topic ON progress(user_id, topic_id, subtopic_id);
CREATE INDEX idx_chat_user_topic ON chat_history(user_id, topic_id, subtopic_id);
CREATE INDEX idx_chat_phase ON chat_history(phase);

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
CREATE TRIGGER users_updated 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER progress_updated 
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ========================================
-- CREATE FIRST ADMIN USER
-- ========================================
-- Insert a default admin user (you can change these credentials)
INSERT INTO users (student_id, password, name, has_access) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', TRUE);

-- Make the admin user an actual admin
INSERT INTO admins (user_id) 
SELECT id FROM users WHERE student_id = 'admin';

-- ========================================
-- VERIFICATION QUERY
-- ========================================
-- Run this to verify everything was created correctly
SELECT 
  'users' as table_name, 
  count(*) as row_count,
  'Created with admin user' as note
FROM users
UNION ALL
SELECT 
  'admins' as table_name, 
  count(*) as row_count,
  'Admin privileges set' as note
FROM admins
UNION ALL
SELECT 
  'progress' as table_name, 
  count(*) as row_count,
  'Ready for learning progress' as note
FROM progress
UNION ALL
SELECT 
  'chat_history' as table_name, 
  count(*) as row_count,
  'Ready for chat storage' as note
FROM chat_history;

-- ========================================
-- SAMPLE TEST DATA (OPTIONAL)
-- ========================================
-- Uncomment these lines if you want some test data

-- Insert test student
-- INSERT INTO users (student_id, password, name, has_access) 
-- VALUES ('student123', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test Student', TRUE);

-- Insert sample progress
-- INSERT INTO progress (user_id, topic_id, subtopic_id, status, phase, current_task)
-- SELECT id, 'foundation', 'first-program', 'in_progress', 'session', 1
-- FROM users WHERE student_id = 'student123';

-- ========================================
-- SCHEMA COMPLETE
-- ========================================
-- Your EduBridge database is now ready!
-- Default admin credentials: admin / password
-- (Password hash is for 'password' - change this in production!)