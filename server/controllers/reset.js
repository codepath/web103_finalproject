import { pool } from '../config/database.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const seedFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
const seedData = JSON.parse(seedFile)

const resetDatabase = async (req, res) => {
  try {
    // Drop and recreate tables in order
    await pool.query(`
      DROP TABLE IF EXISTS meal_food_items CASCADE;
      DROP TABLE IF EXISTS meals CASCADE;
      DROP TABLE IF EXISTS food_items CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
        id serial PRIMARY KEY,
        email varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name varchar(100) NOT NULL,
        goal varchar(20) DEFAULT 'maintain',
        calorie_target int DEFAULT 2000,
        protein_target int DEFAULT 150,
        carb_target int DEFAULT 200,
        fat_target int DEFAULT 65
      );

      CREATE TABLE food_items (
        id serial PRIMARY KEY,
        name varchar(100) NOT NULL,
        calories int NOT NULL,
        protein int NOT NULL,
        carbs int NOT NULL,
        fat int NOT NULL,
        serving_unit varchar(50) NOT NULL
      );

      CREATE TABLE meals (
        id serial PRIMARY KEY,
        user_id int REFERENCES users(id),
        name varchar(100) NOT NULL,
        date date NOT NULL,
        notes text
      );

      CREATE TABLE meal_food_items (
        id serial PRIMARY KEY,
        meal_id int REFERENCES meals(id),
        food_item_id int REFERENCES food_items(id),
        quantity float NOT NULL
      );
    `)

    // Seed users (sample users without real passwords - for testing only)
    for (const user of seedData.users) {
      const email = user.email || `user${user.id}@example.com`
      const password = user.password || '$2b$10$dummyHashForTestingOnly12345678'
      const name = user.name || `User ${user.id}`
      
      await pool.query(
        `INSERT INTO users (id, email, password, name, goal, calorie_target, protein_target, carb_target, fat_target) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [user.id, email, password, name, user.goal, user.calorie_target, user.protein_target, user.carb_target, user.fat_target]
      )
    }

    // Reset users sequence
    await pool.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`)

    // Seed food_items
    for (const item of seedData.food_items) {
      await pool.query(
        'INSERT INTO food_items (id, name, calories, protein, carbs, fat, serving_unit) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [item.id, item.name, item.calories, item.protein, item.carbs, item.fat, item.serving_unit]
      )
    }

    // Reset food_items sequence
    await pool.query(`SELECT setval('food_items_id_seq', (SELECT MAX(id) FROM food_items))`)

    // Seed meals
    for (const meal of seedData.meals) {
      await pool.query(
        'INSERT INTO meals (id, user_id, name, date, notes) VALUES ($1, $2, $3, $4, $5)',
        [meal.id, meal.user_id, meal.name, meal.date, meal.notes]
      )
    }

    // Reset meals sequence
    await pool.query(`SELECT setval('meals_id_seq', (SELECT MAX(id) FROM meals))`)

    // Seed meal_food_items
    for (const entry of seedData.meal_food_items) {
      await pool.query(
        'INSERT INTO meal_food_items (id, meal_id, food_item_id, quantity) VALUES ($1, $2, $3, $4)',
        [entry.id, entry.meal_id, entry.food_item_id, entry.quantity]
      )
    }

    // Reset meal_food_items sequence
    await pool.query(`SELECT setval('meal_food_items_id_seq', (SELECT MAX(id) FROM meal_food_items))`)

    res.status(200).json({ message: 'Database reset successfully' })
  } catch (error) {
    console.error('Reset error:', error)
    res.status(500).json({ error: error.message })
  }
}

export default { resetDatabase }