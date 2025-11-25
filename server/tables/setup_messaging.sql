-- Complete messaging system setup
-- Run this script in Supabase SQL Editor to set up the messaging tables

-- Step 1: Drop old messages table if it exists
DROP TABLE IF EXISTS messages CASCADE;

-- Step 2: Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id_1 BIGINT NOT NULL,
  user_id_2 BIGINT NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT user_order_check CHECK (user_id_1 < user_id_2),
  CONSTRAINT unique_conversation UNIQUE (user_id_1, user_id_2)
);

-- Step 3: Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT fk_conversation 
    FOREIGN KEY (conversation_id) 
    REFERENCES conversations(id) 
    ON DELETE CASCADE
);

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user_id_1);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user_id_2);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(read) WHERE read = FALSE;

-- -- Step 5: Enable Row Level Security (optional, recommended)
-- ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- -- Step 6: Create policies for RLS (users can only see their own conversations/messages)
-- CREATE POLICY "Users can view their own conversations"
--   ON conversations FOR SELECT
--   USING (auth.uid()::bigint = user_id_1 OR auth.uid()::bigint = user_id_2);

-- CREATE POLICY "Users can create conversations"
--   ON conversations FOR INSERT
--   WITH CHECK (auth.uid()::bigint = user_id_1 OR auth.uid()::bigint = user_id_2);

-- CREATE POLICY "Users can view messages in their conversations"
--   ON messages FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM conversations 
--       WHERE conversations.id = messages.conversation_id 
--       AND (conversations.user_id_1 = auth.uid()::bigint OR conversations.user_id_2 = auth.uid()::bigint)
--     )
--   );

-- CREATE POLICY "Users can send messages in their conversations"
--   ON messages FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM conversations 
--       WHERE conversations.id = messages.conversation_id 
--       AND (conversations.user_id_1 = auth.uid()::bigint OR conversations.user_id_2 = auth.uid()::bigint)
--     )
--   );

-- Comments
COMMENT ON TABLE conversations IS 'Stores one-on-one conversations between users';
COMMENT ON TABLE messages IS 'Stores individual messages within conversations';
