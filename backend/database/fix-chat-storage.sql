-- Industry-Level Chat Storage Fix
-- This script ensures proper JSON storage for chat messages with full content preservation

-- First, let's ensure the chat_sessions table exists with proper structure
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    subtopic_id INTEGER NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Use JSONB for better performance
    phase VARCHAR(50) DEFAULT 'session',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_user_topic_subtopic UNIQUE (user_id, topic_id, subtopic_id),
    CONSTRAINT valid_phase CHECK (phase IN ('session', 'playtime', 'assignment', 'mentor'))
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_topic 
    ON chat_sessions (user_id, topic_id, subtopic_id);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_phase 
    ON chat_sessions (phase);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated 
    ON chat_sessions (updated_at DESC);

-- Add GIN index for JSONB message content searching (industry-level feature)
CREATE INDEX IF NOT EXISTS idx_chat_sessions_messages_gin 
    ON chat_sessions USING GIN (messages);

-- Migration function to convert existing string-based messages to proper JSON
CREATE OR REPLACE FUNCTION migrate_chat_messages_to_json()
RETURNS INTEGER AS $$
DECLARE
    session_record RECORD;
    message_lines TEXT[];
    current_line TEXT;
    messages_json JSONB := '[]'::jsonb;
    current_message JSONB;
    current_role TEXT;
    current_content TEXT[];
    message_count INTEGER := 0;
    migrated_count INTEGER := 0;
BEGIN
    -- Process each chat session
    FOR session_record IN 
        SELECT id, user_id, topic_id, subtopic_id, messages, phase
        FROM chat_sessions 
        WHERE messages::text NOT LIKE '[%'  -- Only process non-JSON messages
    LOOP
        -- Reset for each session
        messages_json := '[]'::jsonb;
        current_content := ARRAY[]::TEXT[];
        current_role := NULL;
        
        -- Skip if messages is null or empty
        IF session_record.messages IS NULL OR session_record.messages::text = '' THEN
            CONTINUE;
        END IF;
        
        -- Split the conversation text into lines
        message_lines := string_to_array(session_record.messages::text, E'\n');
        
        -- Process each line
        FOREACH current_line IN ARRAY message_lines
        LOOP
            IF current_line LIKE 'TUTOR: %' THEN
                -- Save previous message if exists
                IF current_role IS NOT NULL AND array_length(current_content, 1) > 0 THEN
                    current_message := jsonb_build_object(
                        'id', 'msg_' || extract(epoch from now())::bigint || '_' || (random() * 1000)::int,
                        'role', current_role,
                        'content', array_to_string(current_content, E'\n'),
                        'phase', session_record.phase,
                        'timestamp', now()::text,
                        'metadata', jsonb_build_object(
                            'migrated', true,
                            'hasMarkdown', (array_to_string(current_content, E'\n') ~ '[*_`#\[\]()~]'),
                            'hasCodeBlocks', (array_to_string(current_content, E'\n') ~ '```'),
                            'contentLength', length(array_to_string(current_content, E'\n'))
                        )
                    );
                    messages_json := messages_json || current_message;
                    message_count := message_count + 1;
                END IF;
                
                -- Start new assistant message
                current_role := 'assistant';
                current_content := ARRAY[substring(current_line from 8)];
                
            ELSIF current_line LIKE 'USER: %' THEN
                -- Save previous message if exists
                IF current_role IS NOT NULL AND array_length(current_content, 1) > 0 THEN
                    current_message := jsonb_build_object(
                        'id', 'msg_' || extract(epoch from now())::bigint || '_' || (random() * 1000)::int,
                        'role', current_role,
                        'content', array_to_string(current_content, E'\n'),
                        'phase', session_record.phase,
                        'timestamp', now()::text,
                        'metadata', jsonb_build_object(
                            'migrated', true,
                            'hasMarkdown', (array_to_string(current_content, E'\n') ~ '[*_`#\[\]()~]'),
                            'hasCodeBlocks', (array_to_string(current_content, E'\n') ~ '```'),
                            'contentLength', length(array_to_string(current_content, E'\n'))
                        )
                    );
                    messages_json := messages_json || current_message;
                    message_count := message_count + 1;
                END IF;
                
                -- Start new user message
                current_role := 'user';
                current_content := ARRAY[substring(current_line from 7)];
                
            ELSIF current_role IS NOT NULL AND trim(current_line) != '' THEN
                -- Continue current message (preserves multi-line content)
                current_content := current_content || current_line;
            END IF;
        END LOOP;
        
        -- Save final message
        IF current_role IS NOT NULL AND array_length(current_content, 1) > 0 THEN
            current_message := jsonb_build_object(
                'id', 'msg_' || extract(epoch from now())::bigint || '_' || (random() * 1000)::int,
                'role', current_role,
                'content', array_to_string(current_content, E'\n'),
                'phase', session_record.phase,
                'timestamp', now()::text,
                'metadata', jsonb_build_object(
                    'migrated', true,
                    'hasMarkdown', (array_to_string(current_content, E'\n') ~ '[*_`#\[\]()~]'),
                    'hasCodeBlocks', (array_to_string(current_content, E'\n') ~ '```'),
                    'contentLength', length(array_to_string(current_content, E'\n'))
                )
            );
            messages_json := messages_json || current_message;
            message_count := message_count + 1;
        END IF;
        
        -- Update the session with proper JSON
        UPDATE chat_sessions 
        SET messages = messages_json,
            updated_at = now()
        WHERE id = session_record.id;
        
        migrated_count := migrated_count + 1;
        
        -- Log progress every 10 sessions
        IF migrated_count % 10 = 0 THEN
            RAISE NOTICE 'Migrated % sessions, % total messages', migrated_count, message_count;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Migration completed: % sessions migrated, % total messages processed', migrated_count, message_count;
    RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- Add function to validate message structure
CREATE OR REPLACE FUNCTION validate_chat_message(message_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check required fields
    IF NOT (message_data ? 'id' AND 
            message_data ? 'role' AND 
            message_data ? 'content' AND 
            message_data ? 'timestamp') THEN
        RETURN FALSE;
    END IF;
    
    -- Validate role
    IF NOT (message_data->>'role' IN ('user', 'assistant', 'system')) THEN
        RETURN FALSE;
    END IF;
    
    -- Validate content is not empty
    IF length(trim(message_data->>'content')) = 0 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add constraint to ensure message structure validity
ALTER TABLE chat_sessions 
ADD CONSTRAINT valid_message_structure 
CHECK (
    CASE 
        WHEN jsonb_typeof(messages) = 'array' THEN 
            (SELECT bool_and(validate_chat_message(message)) 
             FROM jsonb_array_elements(messages) AS message)
        ELSE false
    END
);

-- Create function to get conversation statistics
CREATE OR REPLACE FUNCTION get_conversation_stats(p_user_id INTEGER, p_topic_id INTEGER, p_subtopic_id INTEGER)
RETURNS TABLE (
    total_messages INTEGER,
    user_messages INTEGER,
    assistant_messages INTEGER,
    total_characters BIGINT,
    avg_message_length NUMERIC,
    has_markdown BOOLEAN,
    has_code_blocks BOOLEAN,
    first_message_time TIMESTAMP WITH TIME ZONE,
    last_message_time TIMESTAMP WITH TIME ZONE,
    conversation_phases TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jsonb_array_length(cs.messages) as total_messages,
        (SELECT count(*)::integer FROM jsonb_array_elements(cs.messages) msg WHERE msg->>'role' = 'user') as user_messages,
        (SELECT count(*)::integer FROM jsonb_array_elements(cs.messages) msg WHERE msg->>'role' = 'assistant') as assistant_messages,
        (SELECT sum(length(msg->>'content'))::bigint FROM jsonb_array_elements(cs.messages) msg) as total_characters,
        (SELECT avg(length(msg->>'content'))::numeric FROM jsonb_array_elements(cs.messages) msg) as avg_message_length,
        (SELECT bool_or((msg->'metadata'->>'hasMarkdown')::boolean) FROM jsonb_array_elements(cs.messages) msg) as has_markdown,
        (SELECT bool_or((msg->'metadata'->>'hasCodeBlocks')::boolean) FROM jsonb_array_elements(cs.messages) msg) as has_code_blocks,
        (SELECT min((msg->>'timestamp')::timestamp with time zone) FROM jsonb_array_elements(cs.messages) msg) as first_message_time,
        (SELECT max((msg->>'timestamp')::timestamp with time zone) FROM jsonb_array_elements(cs.messages) msg) as last_message_time,
        (SELECT array_agg(DISTINCT msg->>'phase') FROM jsonb_array_elements(cs.messages) msg) as conversation_phases
    FROM chat_sessions cs
    WHERE cs.user_id = p_user_id 
      AND cs.topic_id = p_topic_id 
      AND cs.subtopic_id = p_subtopic_id;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_sessions_updated_at();

-- Execute the migration (uncomment to run)
-- SELECT migrate_chat_messages_to_json();

COMMENT ON TABLE chat_sessions IS 'Industry-level chat message storage with full content preservation and JSON structure';
COMMENT ON COLUMN chat_sessions.messages IS 'JSONB array of message objects with full metadata and formatting preservation';
COMMENT ON FUNCTION migrate_chat_messages_to_json() IS 'Migrates legacy string-based messages to proper JSON structure';
COMMENT ON FUNCTION get_conversation_stats(INTEGER, INTEGER, INTEGER) IS 'Returns comprehensive statistics for a conversation session';