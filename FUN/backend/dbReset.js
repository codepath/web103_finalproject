import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const resetDatabase = async () => {
  try {
    console.log("🚀 Resetting database to match ERD...");

    // Drop in order to avoid foreign key violations
    await pool.query(`
      DROP TABLE IF EXISTS note_tag CASCADE;
      DROP TABLE IF EXISTS tags CASCADE;
      DROP TABLE IF EXISTS notes CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS settings CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    // 1. Users
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Settings
    await pool.query(`
      CREATE TABLE settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        default_color VARCHAR(7),
        theme VARCHAR(50),
        ai_enabled BOOLEAN DEFAULT true,
        auto_save BOOLEAN DEFAULT false,
        confirm_delete BOOLEAN DEFAULT true
      );
    `);

    // 3. Categories
    await pool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        UNIQUE(user_id, name)
      );
    `);

    // 4. Notes
    await pool.query(`
      CREATE TABLE notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        content TEXT,
        color VARCHAR(7),
        is_pinned BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Tags
    await pool.query(`
      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        UNIQUE(user_id, name)
      );
    `);

    // 6. Note_Tag (Join Table)
    await pool.query(`
      CREATE TABLE note_tag (
        note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (note_id, tag_id)
      );
    `);

    console.log("✨ Database tables created according to ERD!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  }
};

resetDatabase();