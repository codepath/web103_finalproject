-- Migration: Change user.id from integer to UUID for Supabase Auth compatibility
-- WARNING: This will delete existing data in the user table!
-- If you need to preserve data, export it first.

-- Step 1: Drop dependent tables/constraints
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

-- Step 2: Drop and recreate the user table with UUID id
DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT NOT NULL,
  pfp TEXT,
  interests JSONB DEFAULT '{}',
  post_ids JSONB,
  group_ids JSONB,
  follows_ids JSONB DEFAULT '{}',
  message_ids JSONB
);

-- Step 3: Update post table to use UUID for user_id (it's already string, so it should work)
-- The post.user_id is already TEXT/string, so it will accept UUIDs

-- Step 4: Recreate conversations table with UUID user IDs
CREATE TABLE conversations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id_1 UUID NOT NULL,
  user_id_2 UUID NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT conversations_user_id_1_fkey FOREIGN KEY (user_id_1) REFERENCES "user"(id) ON DELETE CASCADE,
  CONSTRAINT conversations_user_id_2_fkey FOREIGN KEY (user_id_2) REFERENCES "user"(id) ON DELETE CASCADE,
  CONSTRAINT unique_conversation UNIQUE (user_id_1, user_id_2)
);

-- Step 5: Recreate messages table with UUID sender_id
CREATE TABLE messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_id BIGINT NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT fk_conversation 
    FOREIGN KEY (conversation_id) 
    REFERENCES conversations(id) 
    ON DELETE CASCADE,
  CONSTRAINT messages_sender_id_fkey 
    FOREIGN KEY (sender_id) 
    REFERENCES "user"(id) 
    ON DELETE CASCADE
);

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user_id_1);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user_id_2);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(read) WHERE read = FALSE;

-- Step 7: Add comments
COMMENT ON TABLE "user" IS 'User profiles linked to Supabase Auth';
COMMENT ON TABLE conversations IS 'One-on-one conversations between users';
COMMENT ON TABLE messages IS 'Individual messages within conversations';
