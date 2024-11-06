import { pool } from '../config/database.js';
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const createTables = async () => {
    const query = `
        --Drop TABLE IF EXISTS user_diets;
        --Drop TABLE IF EXISTS diets;
        --Drop TABLE IF EXISTS favorites;
        --Drop TABLE IF EXISTS ingredients;
        --Drop TABLE IF EXISTS recipes;
        --Drop TABLE IF EXISTS users;
        
        -- Table to store users
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            diet_preferences INTEGER ARRAY, -- Array of diet IDs
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

        -- Table to store recipes details
        CREATE TABLE IF NOT EXISTS recipes (
                id SERIAL PRIMARY KEY,
                spoonacular_recipe_id INTEGER UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                summary TEXT,
                image_url VARCHAR(255),
                servings INTEGER,
                instructions TEXT,
                ready_in_minutes INTEGER
            );

        -- Table to store ingredients associated with each recipe
        CREATE TABLE IF NOT EXISTS ingredients (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                amount NUMERIC(10, 2),
                unit VARCHAR(50)
            );

        -- Join table to store which recipes are marked as favorites by each user
        CREATE TABLE IF NOT EXISTS favorites (
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
                favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, recipe_id)
            );
        
        -- Static table to store diet types
        CREATE TABLE IF NOT EXISTS diets (
            id SERIAL PRIMARY KEY,
            diet_name VARCHAR(50) UNIQUE NOT NULL,
            description TEXT
        );

        
        INSERT INTO diets (diet_name, description) VALUES
        ('Gluten Free', 'Avoids wheat, barley, rye, and gluten-containing grains.'),
        ('Ketogenic', 'High fat, protein-rich, and low carbohydrate diet.'),
        ('Vegetarian', 'No ingredients may contain meat or meat by-products.'),
        ('Lacto-Vegetarian', 'Vegetarian with no eggs.'),
        ('Ovo-Vegetarian', 'Vegetarian with no dairy.'),
        ('Vegan', 'No meat, meat by-products, eggs, dairy, or honey.'),
        ('Pescetarian', 'No meat or meat by-products, may include eggs and dairy.'),
        ('Paleo', 'Includes meat, fish, eggs, vegetables, some oils; excludes grains, legumes, dairy, refined sugar.'),
        ('Primal', 'Similar to Paleo, but includes dairy.'),
        ('Low FODMAP', 'Avoids high FODMAP foods like legumes, wheat, and dairy.'),
        ('Whole30', 'Restricts sweeteners, dairy, alcohol, grains, legumes, and food additives.');
        
        `;
    try {
        const res = await pool.query(query);
        console.log("🎉 Tables created");
    } catch (err) {
        console.log(err,"⚠️ Error creating tables");
    }
};

createTables();
