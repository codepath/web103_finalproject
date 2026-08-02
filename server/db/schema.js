import { pool } from './dbpool.js'

const createTable = async () => {
  const query = `

    drop table if exists scheduled_meals;
    DROP TABLE IF EXISTS ratings;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS recipe_ingredients;
    DROP TABLE IF EXISTS kitchen;
    DROP TABLE IF EXISTS dietary_preferences;
    DROP TABLE IF EXISTS recipes;
    DROP TABLE IF EXISTS ingredients;
    DROP TABLE IF EXISTS users;

    -- CREATE TABLE IF NOT EXISTS users (
    --     id SERIAL PRIMARY KEY,
    --     name TEXT NOT NULL,
    --     email TEXT UNIQUE NOT NULL,
    --     password_hash TEXT NOT NULL,
    --     dietary_preferences TEXT
    -- );

    CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        githubid integer NOT NULL,
        username varchar(100) NOT NULL,
        avatarurl varchar(500) NOT NULL,
        accesstoken varchar(500) NOT NULL,
        email TEXT UNIQUE,
        is_admin BOOLEAN NOT NULL DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS dietary_preferences (
        id serial PRIMARY KEY,
        user_id INTEGER NOT NULL,
        preference varchar(500) NOT NULL,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    );

    CREATE TABLE ingredients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        calories INTEGER,
        dietary_tags TEXT
    );


    CREATE TABLE recipes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        instructions TEXT,
        image_url TEXT,
        avg_rating NUMERIC(3,2) DEFAULT 0
    );


    CREATE TABLE kitchen (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        ingredient_id INTEGER NOT NULL,
        quantity NUMERIC(10,2),
        unit TEXT,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        FOREIGN KEY (ingredient_id)
            REFERENCES ingredients(id)
            ON DELETE CASCADE
    );


    CREATE TABLE recipe_ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER NOT NULL,
        ingredient_id INTEGER NOT NULL,
        quantity NUMERIC(10,2),
        unit TEXT,

        FOREIGN KEY (recipe_id)
            REFERENCES recipes(id)
            ON DELETE CASCADE,

        FOREIGN KEY (ingredient_id)
            REFERENCES ingredients(id)
            ON DELETE CASCADE
    );


    CREATE TABLE favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        FOREIGN KEY (recipe_id)
            REFERENCES recipes(id)
            ON DELETE CASCADE,

        UNIQUE(user_id, recipe_id)
    );


    CREATE TABLE ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,
        stars INTEGER NOT NULL,

        CHECK (stars BETWEEN 1 AND 5),

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        FOREIGN KEY (recipe_id)
            REFERENCES recipes(id)
            ON DELETE CASCADE,

        UNIQUE(user_id, recipe_id)
    );


    CREATE TABLE scheduled_meals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,
        date DATE NOT NULL,
        meal_type TEXT,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        FOREIGN KEY (recipe_id)
            REFERENCES recipes(id)
            ON DELETE CASCADE
    );
  `

  await pool.query(query)

  console.log('EatRite tables created')
}


createTable()
