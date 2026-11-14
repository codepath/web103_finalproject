-- Safe to rerun; preserves existing users and trip data.
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
