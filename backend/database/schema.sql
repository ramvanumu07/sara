-- EduBridge Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== USERS ==========
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

-- ========== ADMINS ==========
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== PROGRESS ==========
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

-- ========== CHAT HISTORY ==========
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id VARCHAR(100) NOT NULL,
  subtopic_id VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  phase VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== INDEXES ==========
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_chat_user_topic ON chat_history(user_id, topic_id, subtopic_id);

-- ========== AUTO UPDATE TIMESTAMP ==========
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER progress_updated BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ========== MIGRATION: Add current_task column if table already exists ==========
-- Run this only if you already have the progress table:
-- 
-- ALTER TABLE progress ADD COLUMN IF NOT EXISTS current_task INTEGER DEFAULT 0;
-- UPDATE progress SET phase = 'session' WHERE phase = 'learning';

-- ========== CREATE FIRST ADMIN (Run after creating your account) ==========
-- 1. Register on the website first
-- 2. Then run this (replace 'your_student_id'):
-- 
-- INSERT INTO admins (user_id) 
-- SELECT id FROM users WHERE student_id = 'your_student_id';

