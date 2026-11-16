-- Add GitHub identities without deleting users, trips, or other application data.
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
CREATE TABLE IF NOT EXISTS user_github_accounts (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  github_id VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS user_sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS user_sessions_expire_idx ON user_sessions (expire);
