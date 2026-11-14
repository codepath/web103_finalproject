
BEGIN;

-- ==========================================
-- USER AUTHENTICATION
-- ==========================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS
users_email_lower_unique
ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS auth_sessions (

    token_hash TEXT PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS
auth_sessions_user_idx
ON auth_sessions(user_id);

CREATE INDEX IF NOT EXISTS
auth_sessions_expiry_idx
ON auth_sessions(expires_at);


-- ==========================================
-- COOKING HISTORY
-- ==========================================

CREATE TABLE IF NOT EXISTS cooking_sessions (

    id BIGSERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    recipe_id INTEGER NOT NULL
        REFERENCES recipes(id),

    servings NUMERIC(8,2) NOT NULL
        CHECK(servings > 0),

    cooked_on DATE NOT NULL,

    request_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    UNIQUE(user_id, request_id)
);


-- ==========================================
-- FOOD USAGE AND FOOD WASTE
-- ==========================================

CREATE TABLE IF NOT EXISTS pantry_activity (

    id BIGSERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    ingredient_id INTEGER NOT NULL
        REFERENCES ingredients(id),

    cooking_session_id BIGINT
        REFERENCES cooking_sessions(id)
        ON DELETE CASCADE,

    kind TEXT NOT NULL
        CHECK(kind IN ('used', 'wasted')),

    quantity NUMERIC(10,2) NOT NULL
        CHECK(quantity > 0),

    unit VARCHAR(30) NOT NULL,

    occurred_on DATE NOT NULL,

    note VARCHAR(200) NOT NULL
        DEFAULT '',

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS
pantry_activity_user_date_idx
ON pantry_activity(user_id, occurred_on);


-- ==========================================
-- NUTRITION GOALS AND GROCERY BUDGET
-- ==========================================

CREATE TABLE IF NOT EXISTS kitchen_goals (

    user_id INTEGER PRIMARY KEY
        REFERENCES users(id)
        ON DELETE CASCADE,

    calories NUMERIC(8,2)
        CHECK(calories > 0),

    protein NUMERIC(8,2)
        CHECK(protein > 0),

    carbs NUMERIC(8,2)
        CHECK(carbs > 0),

    fat NUMERIC(8,2)
        CHECK(fat > 0),

    weekly_budget NUMERIC(10,2)
        CHECK(weekly_budget > 0)
);


-- ==========================================
-- DAILY NUTRITION TRACKING
-- ==========================================

CREATE TABLE IF NOT EXISTS nutrition_entries (

    id BIGSERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    label VARCHAR(150) NOT NULL,

    logged_on DATE NOT NULL,

    calories NUMERIC(10,2) NOT NULL
        CHECK(calories >= 0),

    protein NUMERIC(10,2) NOT NULL
        CHECK(protein >= 0),

    carbs NUMERIC(10,2) NOT NULL
        CHECK(carbs >= 0),

    fat NUMERIC(10,2) NOT NULL
        CHECK(fat >= 0),

    source VARCHAR(200) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS
nutrition_user_date_idx
ON nutrition_entries(user_id, logged_on);


-- ==========================================
-- GROCERY EXPENSES
-- ==========================================

CREATE TABLE IF NOT EXISTS grocery_expenses (

    id BIGSERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    label VARCHAR(150) NOT NULL,

    amount NUMERIC(10,2) NOT NULL
        CHECK(amount > 0),

    purchased_on DATE NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS
grocery_expenses_user_date_idx
ON grocery_expenses(user_id, purchased_on);

COMMIT;
