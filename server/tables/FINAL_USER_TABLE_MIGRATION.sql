-- ==============================================================================
-- FINAL USER TABLE MIGRATION
-- Merges 'user' and 'profiles' tables into a single 'user' table
-- ==============================================================================

-- Step 1: Drop old tables and recreate with merged schema
-- NOTE: We must drop messages/conversations because they have foreign keys to user.id
-- When we change user.id from integer to UUID, the foreign keys break
-- If you need to preserve data, export tables first, then re-import with UUIDs

-- Drop in order (child tables first, then parent)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 2: Create the unified user table
CREATE TABLE "user" (
  -- Core Identity (from Supabase Auth)
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Profile Info (from both tables)
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  pfp TEXT, -- profile picture URL
  bio TEXT,
  
  -- Location & School Info (from profiles)
  borough TEXT,
  year TEXT, -- Freshman, Sophomore, Junior, Senior
  
  -- Social Data (from user table)
  interests JSONB DEFAULT '{}', -- {"activity": true, "another": true}
  follows_ids JSONB DEFAULT '{}', -- {"user_uuid": true}
  
  -- Legacy fields (nullable, can be removed later if not used)
  post_ids JSONB,
  group_ids JSONB,
  message_ids JSONB
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_user_username ON "user"(username);
CREATE INDEX idx_user_borough ON "user"(borough);
CREATE INDEX idx_user_year ON "user"(year);

-- Step 4: Recreate conversations table with UUID foreign keys
CREATE TABLE conversations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id_1 UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure user_id_1 is alphabetically before user_id_2 for UUIDs
  CONSTRAINT unique_conversation UNIQUE (user_id_1, user_id_2),
  CONSTRAINT check_user_order CHECK (user_id_1 < user_id_2)
);

CREATE INDEX idx_conversations_user1 ON conversations(user_id_1);
CREATE INDEX idx_conversations_user2 ON conversations(user_id_2);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- Step 5: Recreate messages table
CREATE TABLE messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(read) WHERE read = FALSE;

-- Step 6: Enable Row Level Security (RLS) - OPTIONAL but recommended
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Users can view all profiles"
  ON "user" FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON "user" FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
  ON "user" FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Conversations: users can only see their own
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Messages: users can only see messages in their conversations
CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.user_id_1 = auth.uid() OR conversations.user_id_2 = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.user_id_1 = auth.uid() OR conversations.user_id_2 = auth.uid())
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.user_id_1 = auth.uid() OR conversations.user_id_2 = auth.uid())
    )
  );

-- Step 7: Add helpful comments
COMMENT ON TABLE "user" IS 'Unified user profile table - links to Supabase Auth via UUID';
COMMENT ON COLUMN "user".id IS 'UUID from Supabase Auth (auth.users.id)';
COMMENT ON COLUMN "user".interests IS 'JSON object: {"activity_name": true}';
COMMENT ON COLUMN "user".follows_ids IS 'JSON object: {"friend_uuid": true}';
COMMENT ON TABLE conversations IS 'One-on-one conversations between users';
COMMENT ON TABLE messages IS 'Individual messages within conversations';

-- Step 8: Create a function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
