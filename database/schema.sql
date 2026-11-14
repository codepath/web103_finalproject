
-- PrepWise PostgreSQL Database Schema

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Ingredients
CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Recipes
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    prep_minutes INTEGER CHECK (prep_minutes >= 0),
    cook_minutes INTEGER CHECK (cook_minutes >= 0),
    servings INTEGER CHECK (servings > 0),
    meal_type VARCHAR(30),
    dietary_preference VARCHAR(50),
    image_url TEXT,
    mealdb_id TEXT UNIQUE
);

-- 4. Pantry Inventory
CREATE TABLE IF NOT EXISTS pantry_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(30) NOT NULL,
    expiration_date DATE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Recipe Ingredients (Many-to-Many)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INTEGER NOT NULL REFERENCES recipes(id),
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(30) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- 6. Weekly Meal Planner
CREATE TABLE IF NOT EXISTS meal_plan_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    recipe_id INTEGER NOT NULL REFERENCES recipes(id),
    planned_date DATE NOT NULL,
    meal_type VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Saved Recipes (Many-to-Many)
CREATE TABLE IF NOT EXISTS saved_recipes (
    user_id INTEGER NOT NULL REFERENCES users(id),
    recipe_id INTEGER NOT NULL REFERENCES recipes(id),
    saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
);

-- 8. Shopping List
CREATE TABLE IF NOT EXISTS shopping_list_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(30) NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    source VARCHAR(20) DEFAULT 'manual'
);
