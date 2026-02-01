-- ========================================
-- Migration: Convert chat_sessions.messages from JSONB to TEXT
-- ========================================
-- This migration converts existing JSONB message arrays to clean TEXT strings

-- Step 1: Add new TEXT column temporarily
ALTER TABLE chat_sessions ADD COLUMN messages_text TEXT DEFAULT '';

-- Step 2: Convert existing JSONB data to TEXT format
UPDATE chat_sessions 
SET messages_text = (
  SELECT string_agg(
    CASE 
      WHEN (msg->>'role') = 'assistant' THEN 'AGENT: ' || (msg->>'content')
      WHEN (msg->>'role') = 'user' THEN 'USER: ' || (msg->>'content')
      ELSE ''
    END, 
    E'\n' 
    ORDER BY (msg->>'timestamp')::timestamp
  )
  FROM jsonb_array_elements(messages) AS msg
  WHERE jsonb_array_length(messages) > 0
);

-- Step 3: Handle empty arrays (set to empty string)
UPDATE chat_sessions 
SET messages_text = '' 
WHERE messages_text IS NULL;

-- Step 4: Drop old JSONB column
ALTER TABLE chat_sessions DROP COLUMN messages;

-- Step 5: Rename new TEXT column to messages
ALTER TABLE chat_sessions RENAME COLUMN messages_text TO messages;

-- Step 6: Update column to NOT NULL with default
ALTER TABLE chat_sessions ALTER COLUMN messages SET NOT NULL;
ALTER TABLE chat_sessions ALTER COLUMN messages SET DEFAULT '';

-- Verification query (run this to check the conversion)
-- SELECT user_id, topic_id, subtopic_id, 
--        LENGTH(messages) as message_length,
--        CASE 
--          WHEN messages = '' THEN 'Empty'
--          WHEN messages LIKE '%AGENT:%' AND messages LIKE '%USER:%' THEN 'Converted'
--          WHEN messages LIKE '%AGENT:%' OR messages LIKE '%USER:%' THEN 'Partial'
--          ELSE 'Unknown'
--        END as conversion_status
-- FROM chat_sessions 
-- ORDER BY updated_at DESC;

COMMENT ON COLUMN chat_sessions.messages IS 'Chat messages stored as TEXT in AGENT:/USER: format, one message per line';