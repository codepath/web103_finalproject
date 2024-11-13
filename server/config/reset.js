// import { pool } from './database.js';
// import "./dotenv.js";

import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

// Define the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import `pool` from database.js
const { pool } = await import(pathToFileURL(path.resolve(__dirname, '../config/database.js')).href);

// Rest of your reset.js code, using `pool`

// Rest of your reset.js code, using `pool`
const createUserTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

  try {
    await pool.query(query);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

// const seedUserTable = async () => {
//     createUserTable();
//     const query = `
//                 INSERT INTO users (username, password_hash, email)
//                 VALUES ('admin', 'admin', 'tempemail@gmail.com');
//             `;

//     try {
//         await pool.query(query);
//         console.log('User table seeded successfully');
//     } catch (error) {
//         console.error('Error seeding user table:', error);
//     }
// }

// seedUserTable();

createUserTable();
