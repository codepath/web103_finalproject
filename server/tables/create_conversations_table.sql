-- Create conversations table for direct messaging
-- This table tracks one-on-one conversations between users

CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id_1 BIGINT NOT NULL,
  user_id_2 BIGINT NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure user_id_1 is always less than user_id_2 to prevent duplicates
  CONSTRAINT user_order_check CHECK (user_id_1 < user_id_2),
  
  -- Ensure unique conversation between two users
  CONSTRAINT unique_conversation UNIQUE (user_id_1, user_id_2)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user_id_1);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user_id_2);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Add comment
COMMENT ON TABLE conversations IS 'Stores one-on-one conversations between users';
