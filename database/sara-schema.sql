-- ============================================================================
-- SARA LEARNING PLATFORM - DATABASE SCHEMA
-- Industry-Level Database Design for Single-Topic Architecture
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE - Enhanced with new fields for Sara
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL, -- Hashed password
    has_access BOOLEAN DEFAULT true,
    access_expires_at TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT users_username_length CHECK (LENGTH(username) >= 3),
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_name_length CHECK (LENGTH(name) >= 2)
);

-- ============================================================================
-- PROGRESS TABLE - Simplified Single-Topic Structure
-- ============================================================================
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(100) NOT NULL, -- Single level topic (e.g., 'console-log', 'variables', 'functions')
    
    -- Progress tracking
    status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'locked')),
    phase VARCHAR(50) DEFAULT 'session' CHECK (phase IN ('session', 'playtime', 'assignment', 'feedback', 'completed')),
    
    -- Task tracking
    current_task INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    assignments_completed INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    
    -- Learning state
    concept_revealed BOOLEAN DEFAULT false,
    saved_code TEXT DEFAULT '',
    current_outcome_index INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, topic_id),
    CONSTRAINT progress_task_bounds CHECK (current_task >= 0 AND current_task <= total_tasks),
    CONSTRAINT progress_hints_positive CHECK (hints_used >= 0),
    CONSTRAINT progress_outcome_positive CHECK (current_outcome_index >= 0)
);

-- ============================================================================
-- CHAT_SESSIONS TABLE - Simplified Single-Topic Structure
-- ============================================================================
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(100) NOT NULL, -- Single level topic
    
    -- Chat data
    messages TEXT NOT NULL DEFAULT '', -- "USER: message\nAGENT: response\n..." format
    phase VARCHAR(50) DEFAULT 'session' CHECK (phase IN ('session', 'playtime', 'assignment', 'feedback')),
    
    -- Metadata
    message_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, topic_id),
    CONSTRAINT chat_message_count_positive CHECK (message_count >= 0)
);

-- ============================================================================
-- ADMINS TABLE - For administrative access
-- ============================================================================
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    permissions TEXT[] DEFAULT ARRAY['read', 'write'], -- Array of permissions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);

-- ============================================================================
-- PASSWORD_RESET_TOKENS TABLE - For forgot password functionality
-- ============================================================================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT token_not_expired CHECK (expires_at > created_at)
);

-- ============================================================================
-- USER_SESSIONS TABLE - For session management
-- ============================================================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT session_not_expired CHECK (expires_at > created_at)
);

-- ============================================================================
-- LEARNING_ANALYTICS TABLE - For tracking learning patterns
-- ============================================================================
CREATE TABLE learning_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(100) NOT NULL,
    
    -- Analytics data
    time_spent_seconds INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    hints_requested INTEGER DEFAULT 0,
    attempts_made INTEGER DEFAULT 0,
    errors_encountered INTEGER DEFAULT 0,
    
    -- Session data
    session_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, topic_id, session_date),
    CONSTRAINT analytics_positive_values CHECK (
        time_spent_seconds >= 0 AND 
        messages_sent >= 0 AND 
        hints_requested >= 0 AND 
        attempts_made >= 0 AND 
        errors_encountered >= 0
    )
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_last_login ON users(last_login);

-- Progress table indexes
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_user_topic ON progress(user_id, topic_id);
CREATE INDEX idx_progress_status ON progress(status);
CREATE INDEX idx_progress_phase ON progress(phase);
CREATE INDEX idx_progress_last_accessed ON progress(last_accessed);

-- Chat sessions indexes
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_user_topic ON chat_sessions(user_id, topic_id);
CREATE INDEX idx_chat_sessions_last_message ON chat_sessions(last_message_at);

-- Password reset tokens indexes
CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- User sessions indexes
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Learning analytics indexes
CREATE INDEX idx_learning_analytics_user ON learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_topic ON learning_analytics(topic_id);
CREATE INDEX idx_learning_analytics_date ON learning_analytics(session_date);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_analytics_updated_at BEFORE UPDATE ON learning_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY users_own_data ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY progress_own_data ON progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY chat_sessions_own_data ON chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY password_reset_own_data ON password_reset_tokens FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_sessions_own_data ON user_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY learning_analytics_own_data ON learning_analytics FOR ALL USING (auth.uid() = user_id);

-- Admins can access all data
CREATE POLICY admins_full_access ON users FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
CREATE POLICY admins_progress_access ON progress FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
CREATE POLICY admins_chat_access ON chat_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
CREATE POLICY admins_analytics_access ON learning_analytics FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert a test admin user (password: 'admin123')
INSERT INTO users (username, email, name, password, has_access) VALUES 
('admin', 'admin@sara.com', 'Sara Admin', '$2b$10$rGKqHNKqFEZKqJ3qKqHNKOqFEZKqJ3qKqHNKOqFEZKqJ3qKqHNKO', true);

-- Make the first user an admin
INSERT INTO admins (user_id) VALUES (
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to get user's current learning progress
CREATE OR REPLACE FUNCTION get_user_progress_summary(p_user_id UUID)
RETURNS TABLE (
    total_topics INTEGER,
    completed_topics INTEGER,
    in_progress_topics INTEGER,
    completion_percentage DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_topics,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::INTEGER as completed_topics,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END)::INTEGER as in_progress_topics,
        CASE 
            WHEN COUNT(*) = 0 THEN 0::DECIMAL
            ELSE ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
        END as completion_percentage
    FROM progress 
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's last accessed topic
CREATE OR REPLACE FUNCTION get_last_accessed_topic(p_user_id UUID)
RETURNS TABLE (
    topic_id VARCHAR(100),
    phase VARCHAR(50),
    last_accessed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.topic_id,
        p.phase,
        p.last_accessed
    FROM progress p
    WHERE p.user_id = p_user_id 
    AND p.status IN ('in_progress', 'completed')
    ORDER BY p.last_accessed DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'User accounts with enhanced fields for Sara platform';
COMMENT ON TABLE progress IS 'Learning progress tracking per topic (single-level)';
COMMENT ON TABLE chat_sessions IS 'Chat conversation history per topic';
COMMENT ON TABLE admins IS 'Administrative users with elevated permissions';
COMMENT ON TABLE password_reset_tokens IS 'Tokens for password reset functionality';
COMMENT ON TABLE user_sessions IS 'Active user sessions for security tracking';
COMMENT ON TABLE learning_analytics IS 'Learning behavior analytics and metrics';

COMMENT ON COLUMN progress.topic_id IS 'Single-level topic ID (e.g., console-log, variables)';
COMMENT ON COLUMN chat_sessions.messages IS 'Chat history in USER:/AGENT: string format';
COMMENT ON COLUMN learning_analytics.time_spent_seconds IS 'Total time spent on topic in seconds';

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================