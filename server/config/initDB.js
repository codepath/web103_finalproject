import { pool } from './database.js'

const initDB = async () => {
    try {
        await pool.query(createUserTableQuery)
    } catch (error) {
        console.error('Error initializing database', error)
    }
}

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    github_id VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    failed_login_attempts INT DEFAULT 0
)
`
initDB()