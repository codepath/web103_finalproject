import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'
import bcrypt from 'bcrypt'

const currentPath = fileURLToPath(import.meta.url)

const seedFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))

const seedData = JSON.parse(seedFile)

// ─── CREATE TABLES ───────────────────────────────────────────────────────────

const createUsersTable = async () => {
  const createUsersTableQuery = `
    DROP TABLE IF EXISTS users CASCADE;

    CREATE TABLE IF NOT EXISTS users (
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
  `
  try {
    await pool.query(createUsersTableQuery)
    console.log('🎉 users table created successfully')
  } catch (err) {
    console.error('⚠️ error creating users table', err)
  }
}

const createFoodItemsTable = async () => {
  const createFoodItemsTableQuery = `
    DROP TABLE IF EXISTS food_items CASCADE;

    CREATE TABLE IF NOT EXISTS food_items (
      id serial PRIMARY KEY,
      name varchar(100) NOT NULL,
      calories int NOT NULL,
      protein int NOT NULL,
      carbs int NOT NULL,
      fat int NOT NULL,
      serving_unit varchar(50) NOT NULL
    );
  `
  try {
    await pool.query(createFoodItemsTableQuery)
    console.log('🎉 food_items table created successfully')
  } catch (err) {
    console.error('⚠️ error creating food_items table', err)
  }
}

const createMealsTable = async () => {
  const createMealsTableQuery = `
    DROP TABLE IF EXISTS meals CASCADE;

    CREATE TABLE IF NOT EXISTS meals (
      id serial PRIMARY KEY,
      user_id int REFERENCES users(id),
      name varchar(100) NOT NULL,
      date date NOT NULL,
      notes text
    );
  `
  try {
    await pool.query(createMealsTableQuery)
    console.log('🎉 meals table created successfully')
  } catch (err) {
    console.error('⚠️ error creating meals table', err)
  }
}

const createMealFoodItemsTable = async () => {
  const createMealFoodItemsTableQuery = `
    DROP TABLE IF EXISTS meal_food_items CASCADE;

    CREATE TABLE IF NOT EXISTS meal_food_items (
      id serial PRIMARY KEY,
      meal_id int REFERENCES meals(id),
      food_item_id int REFERENCES food_items(id),
      quantity float NOT NULL
    );
  `
  try {
    await pool.query(createMealFoodItemsTableQuery)
    console.log('🎉 meal_food_items table created successfully')
  } catch (err) {
    console.error('⚠️ error creating meal_food_items table', err)
  }
}

// ─── SEED TABLES ─────────────────────────────────────────────────────────────

const seedUsersTable = async () => {
  await createUsersTable()

  for (const user of seedData.users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const insertQuery = {
      text: 'INSERT INTO users (id, email, password, name, goal, calorie_target, protein_target, carb_target, fat_target) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
    }
    const values = [user.id, user.email, hashedPassword, user.name, user.goal, user.calorie_target, user.protein_target, user.carb_target, user.fat_target]

    try {
      await pool.query(insertQuery, values)
      console.log(`✅ user (${user.goal}) added successfully`)
    } catch (err) {
      console.error('⚠️ error inserting user', err)
    }
  }

  await pool.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`) // sync sequence to highest seeded id — without this, the next INSERT would try id=1 and throw a duplicate key error
}

const seedFoodItemsTable = async () => {
  await createFoodItemsTable()

  for (const item of seedData.food_items) {
    const insertQuery = {
      text: 'INSERT INTO food_items (id, name, calories, protein, carbs, fat, serving_unit) VALUES ($1, $2, $3, $4, $5, $6, $7)'
    }
    const values = [item.id, item.name, item.calories, item.protein, item.carbs, item.fat, item.serving_unit]

    try {
      await pool.query(insertQuery, values)
      console.log(`✅ ${item.name} added successfully`)
    } catch (err) {
      console.error('⚠️ error inserting food item', err)
    }
  }

  await pool.query(`SELECT setval('food_items_id_seq', (SELECT MAX(id) FROM food_items))`) // sync sequence to highest seeded id — without this, the next INSERT would try id=1 and throw a duplicate key error
}

const seedMealsTable = async () => {
  await createMealsTable()

  for (const meal of seedData.meals) {
    const insertQuery = {
      text: 'INSERT INTO meals (id, user_id, name, date, notes) VALUES ($1, $2, $3, $4, $5)'
    }
    const values = [meal.id, meal.user_id, meal.name, meal.date, meal.notes]

    try {
      await pool.query(insertQuery, values)
      console.log(`✅ ${meal.name} added successfully`)
    } catch (err) {
      console.error('⚠️ error inserting meal', err)
    }
  }

  await pool.query(`SELECT setval('meals_id_seq', (SELECT MAX(id) FROM meals))`) // sync sequence to highest seeded id — without this, the next INSERT would try id=1 and throw a duplicate key error
}

const seedMealFoodItemsTable = async () => {
  await createMealFoodItemsTable()

  for (const entry of seedData.meal_food_items) {
    const insertQuery = {
      text: 'INSERT INTO meal_food_items (id, meal_id, food_item_id, quantity) VALUES ($1, $2, $3, $4)'
    }
    const values = [entry.id, entry.meal_id, entry.food_item_id, entry.quantity]

    try {
      await pool.query(insertQuery, values)
      console.log(`✅ meal_food_item (meal ${entry.meal_id} + food ${entry.food_item_id}) added successfully`)
    } catch (err) {
      console.error('⚠️ error inserting meal_food_item', err)
    }
  }

  await pool.query(`SELECT setval('meal_food_items_id_seq', (SELECT MAX(id) FROM meal_food_items))`) // sync sequence to highest seeded id — without this, the next INSERT would try id=1 and throw a duplicate key error
}

// ─── RUN ─────────────────────────────────────────────────────────────────────

const seed = async () => {
  await seedUsersTable()
  await seedFoodItemsTable()
  await seedMealsTable()
  await seedMealFoodItemsTable()
}

seed()
