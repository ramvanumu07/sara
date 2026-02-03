-- ============================================================================
-- DATABASE OPTIMIZATIONS - SARA LEARNING PLATFORM
-- Performance improvements and indexing for production workloads
-- ============================================================================

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Progress table indexes
CREATE INDEX IF NOT EXISTS idx_progress_user_topic ON progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_status ON progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_progress_user_phase ON progress(user_id, phase);
CREATE INDEX IF NOT EXISTS idx_progress_last_accessed ON progress(last_accessed DESC);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON progress(topic_completed) WHERE topic_completed = true;

-- Chat sessions indexes
CREATE INDEX IF NOT EXISTS idx_chat_user_topic ON chat_sessions(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_chat_user_phase ON chat_sessions(user_id, phase);
CREATE INDEX IF NOT EXISTS idx_chat_last_message ON chat_sessions(last_message_at DESC);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(has_access) WHERE has_access = true;

-- User sessions indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- ============================================================================
-- PERFORMANCE VIEWS
-- ============================================================================

-- User progress summary view
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
  p.user_id,
  COUNT(*) as total_topics_started,
  COUNT(*) FILTER (WHERE p.topic_completed = true) as topics_completed,
  COUNT(*) FILTER (WHERE p.status = 'in_progress') as topics_in_progress,
  ROUND(
    (COUNT(*) FILTER (WHERE p.topic_completed = true)::decimal / COUNT(*)) * 100, 
    2
  ) as completion_percentage,
  MAX(p.last_accessed) as last_activity,
  MIN(p.started_at) as first_started
FROM progress p
GROUP BY p.user_id;

-- Topic popularity view
CREATE OR REPLACE VIEW topic_popularity AS
SELECT 
  p.topic_id,
  COUNT(DISTINCT p.user_id) as users_started,
  COUNT(DISTINCT p.user_id) FILTER (WHERE p.topic_completed = true) as users_completed,
  ROUND(
    (COUNT(DISTINCT p.user_id) FILTER (WHERE p.topic_completed = true)::decimal / 
     COUNT(DISTINCT p.user_id)) * 100, 
    2
  ) as completion_rate,
  AVG(EXTRACT(EPOCH FROM (p.completed_at - p.started_at))/3600) FILTER (WHERE p.completed_at IS NOT NULL) as avg_hours_to_complete
FROM progress p
GROUP BY p.topic_id
ORDER BY users_started DESC;

-- Active users view
CREATE OR REPLACE VIEW active_users AS
SELECT 
  u.id,
  u.username,
  u.name,
  u.email,
  u.last_login,
  ups.total_topics_started,
  ups.topics_completed,
  ups.completion_percentage,
  ups.last_activity
FROM users u
LEFT JOIN user_progress_summary ups ON u.id = ups.user_id
WHERE u.has_access = true
ORDER BY ups.last_activity DESC NULLS LAST;

-- ============================================================================
-- CLEANUP FUNCTIONS
-- ============================================================================

-- Function to clean old chat sessions (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_chat_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM chat_sessions 
  WHERE last_message_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired user sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MAINTENANCE PROCEDURES
-- ============================================================================

-- Update table statistics for better query planning
ANALYZE users;
ANALYZE progress;
ANALYZE chat_sessions;

-- ============================================================================
-- PERFORMANCE MONITORING
-- ============================================================================

-- Enable query statistics (if not already enabled)
-- Note: This requires superuser privileges
-- ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Query to find slow queries (run periodically)
/*
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
WHERE mean_time > 100 -- queries taking more than 100ms on average
ORDER BY mean_time DESC
LIMIT 10;
*/

-- ============================================================================
-- BACKUP RECOMMENDATIONS
-- ============================================================================

/*
-- Recommended backup strategy:

-- 1. Daily full backup
pg_dump -h localhost -U postgres -d sara_db -f sara_backup_$(date +%Y%m%d).sql

-- 2. Point-in-time recovery setup
-- Enable WAL archiving in postgresql.conf:
-- wal_level = replica
-- archive_mode = on
-- archive_command = 'cp %p /path/to/archive/%f'

-- 3. Monitor backup success
-- Set up alerts for failed backups
*/

-- ============================================================================
-- SECURITY ENHANCEMENTS
-- ============================================================================

-- Enable row level security on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for users to only access their own data
CREATE POLICY user_own_progress ON progress
  FOR ALL TO authenticated_users
  USING (user_id = current_user_id());

CREATE POLICY user_own_chat ON chat_sessions
  FOR ALL TO authenticated_users
  USING (user_id = current_user_id());

-- Note: You'll need to implement current_user_id() function based on your auth system

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Database optimizations applied successfully!';
  RAISE NOTICE 'Indexes created for improved query performance';
  RAISE NOTICE 'Views created for analytics and reporting';
  RAISE NOTICE 'Cleanup functions available for maintenance';
  RAISE NOTICE 'Run ANALYZE periodically to update statistics';
END $$;