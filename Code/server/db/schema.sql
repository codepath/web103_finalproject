-- =========================================================
-- MatchLens Database Schema
--
-- This is the ONE place that defines what the database looks like.
-- If you need to add a column or table, change it here first, then
-- run `npm run reset` to rebuild the database from this file.
--
-- Team/match/player data itself comes from an external football API —
-- we only store api_team_id / api_match_id as reference strings, not
-- as foreign keys to local team/match tables.
-- =========================================================

-- Drop in reverse dependency order so foreign keys don't block us
DROP TABLE IF EXISTS video_links;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS predictions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS followed_teams;
DROP TABLE IF EXISTS users;

-- =========================================================
-- USERS — one row per account
--
-- An account is reachable either by password (local signup) or by
-- github_id (OAuth), so neither credential column can be NOT NULL on
-- its own — the users_has_credential CHECK enforces "at least one".
-- =========================================================
CREATE TABLE users (
    user_id           SERIAL PRIMARY KEY,
    username          VARCHAR(50)  NOT NULL UNIQUE,
    email             VARCHAR(255) NOT NULL UNIQUE,
    password_hash     VARCHAR(255),          -- NULL for a GitHub-only account
    github_id         VARCHAR(255) UNIQUE,   -- GitHub's numeric id, as text
    profile_image_url VARCHAR(500),          -- GitHub avatar_url for OAuth users
    total_points      INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT users_has_credential
        CHECK (password_hash IS NOT NULL OR github_id IS NOT NULL)
);

-- =========================================================
-- FOLLOWED_TEAMS — which teams a user follows
-- =========================================================
CREATE TABLE followed_teams (
    followed_team_id SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    api_team_id      VARCHAR(50)  NOT NULL, -- id from the external football API
    team_name        VARCHAR(150) NOT NULL, -- cached so we don't re-call the API just to show a name
    followed_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, api_team_id) -- can't follow the same team twice
);

CREATE INDEX idx_followed_teams_user_id     ON followed_teams(user_id);
CREATE INDEX idx_followed_teams_api_team_id ON followed_teams(api_team_id);

-- =========================================================
-- COMMENTS — fan chat on a match
-- =========================================================
CREATE TABLE comments (
    comment_id   SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    api_match_id VARCHAR(50) NOT NULL,
    content      TEXT NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_user_id      ON comments(user_id);
CREATE INDEX idx_comments_api_match_id ON comments(api_match_id);

-- =========================================================
-- PREDICTIONS — the wager/points mechanic
-- =========================================================
CREATE TABLE predictions (
    prediction_id        SERIAL PRIMARY KEY,
    user_id              INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    api_match_id          VARCHAR(50) NOT NULL,
    predicted_home_score  INTEGER NOT NULL,
    predicted_away_score  INTEGER NOT NULL,
    points_awarded        INTEGER NOT NULL DEFAULT 0, -- filled in after the match ends
    submitted_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, api_match_id) -- one prediction per user per match
);

CREATE INDEX idx_predictions_user_id      ON predictions(user_id);
CREATE INDEX idx_predictions_api_match_id ON predictions(api_match_id);

-- =========================================================
-- NOTIFICATIONS — in-app alerts
-- =========================================================
CREATE TABLE notifications (
    notification_id   SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    api_team_id       VARCHAR(50),  -- set if this alert is team-related
    api_match_id      VARCHAR(50),  -- set if this alert is match-related
    notification_type VARCHAR(50) NOT NULL, -- e.g. 'match_alert', 'transfer_news'
    message           TEXT NOT NULL,
    is_read           BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread  ON notifications(user_id, is_read);

-- =========================================================
-- VIDEO_LINKS — highlight clips attached to a match
-- =========================================================
CREATE TABLE video_links (
    video_link_id SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    api_match_id  VARCHAR(50)  NOT NULL,
    title         VARCHAR(255) NOT NULL,
    video_url     VARCHAR(500) NOT NULL,
    provider      VARCHAR(50), -- e.g. 'youtube'
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_video_links_api_match_id ON video_links(api_match_id);

-- =========================================================
-- Auto-update `updated_at` whenever a row changes
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
