// server/db/init.js
import { pool } from "../config/database.js";

export async function initDb() {
  console.log("Initializing database (ensuring tables exist)…");

  // USERS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      points INTEGER NOT NULL DEFAULT 0
    );
  `);

  // HABITS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS habits (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(120) NOT NULL,
      description TEXT
    );
  `);

  // TAGS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE
    );
  `);

  // HABIT_TAGS (join table)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS habit_tags (
      habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (habit_id, tag_id)
    );
  `);

  // STICKERS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stickers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      price INTEGER NOT NULL CHECK (price >= 0),
      image_url TEXT
    );
  `);

  // USER_STICKERS (join table)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_stickers (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      sticker_id INTEGER NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, sticker_id)
    );
  `);

  // Seed demo user (for timer points)
  await pool.query(`
    INSERT INTO users (username, password, points)
    VALUES ('demo', '$2b$10$examplehash', 0)
    ON CONFLICT (username) DO NOTHING;
  `);

  console.log("✅ DB init complete (tables ensured)");
}
