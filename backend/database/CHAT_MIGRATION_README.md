# Chat Storage Migration

## Overview
We've migrated from storing individual messages as separate rows to storing entire chat sessions as single rows with JSONB message arrays.

## Benefits
- **Storage Efficiency**: 20 topics = 20 rows instead of thousands of message rows
- **Simpler Queries**: One query to get entire conversation
- **Better Performance**: Less database overhead and faster retrieval
- **Predictable Scaling**: Storage scales with number of topics, not conversation length

## Migration Steps

### 1. Backup Existing Data (Important!)
Before running any migration, backup your database:
```sql
-- Create backup
CREATE TABLE chat_history_backup AS SELECT * FROM chat_history;
```

### 2. Run Migration Script
```bash
# Run the migration script to preserve existing data
psql -d your_database -f migrate-chat-to-sessions.sql
```

### 3. Verify Migration
The migration script includes verification queries. Check that:
- Message counts match between old and new tables
- Sample data looks correct
- No data was lost

### 4. Deploy New Code
Deploy the updated backend code that uses the new `chat_sessions` table.

### 5. Clean Up (After verification)
Once you've verified everything works:
```sql
-- Only after confirming everything works correctly
DROP TABLE chat_history;
DROP TABLE chat_history_backup;
```

## New Schema Structure

### Before (chat_history)
```sql
CREATE TABLE chat_history (
  id UUID PRIMARY KEY,
  user_id UUID,
  topic_id VARCHAR(100),
  subtopic_id VARCHAR(100),
  role VARCHAR(20),      -- 'user' or 'assistant'
  content TEXT,          -- Individual message
  phase VARCHAR(50),
  created_at TIMESTAMP
);
```

### After (chat_sessions)
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY,
  user_id UUID,
  topic_id VARCHAR(100),
  subtopic_id VARCHAR(100),
  messages JSONB,        -- Array of all messages
  phase VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, topic_id, subtopic_id)
);
```

## Message Format
Each message in the JSONB array:
```json
{
  "role": "user" | "assistant",
  "content": "message text",
  "timestamp": "2024-01-01T10:00:00Z",
  "phase": "session" | "playtime" | "assignment" | "feedback"
}
```

## API Changes
The API remains the same - all changes are internal to the storage layer. The service functions (`getChatHistory`, `saveChatMessage`, etc.) work exactly as before.

## Rollback Plan
If issues arise:
1. Stop the application
2. Restore from `chat_history_backup` table
3. Deploy previous version of code
4. Investigate issues before re-attempting migration