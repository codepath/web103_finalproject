import { pool } from '../database.js'
import '../dotenv.js'
import users from '../../mock_data/users.js'
import bcrypt from 'bcrypt'

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

const createUsersTableQuery = `
    DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        phone_number VARCHAR(20)
    );
`

const createUsersTable = async () => {
  try {
    await pool.query(createUsersTableQuery)
    console.log('🛠️ users table created')
  } catch (error) {
    console.error('⚠️ Error creating users table', error)
  }
}

const seedUsersTable = async () => {
  try {
    await createUsersTable()
    for (const user of users) {
      const insertQuery = `INSERT INTO users (username, password, email, full_name, phone_number) VALUES ($1, $2, $3, $4, $5)`
      const hashedPassword = await hashPassword(user.password)
      const values = [
        user.username,
        hashedPassword,
        user.email,
        user.full_name,
        user.phone_number,
      ]
      await pool.query(insertQuery, values)
      console.log(`👤 User ${user.username} inserted successfully`)
    }
  } catch (error) {
    console.error('⚠️ Error seeding users table', error)
  }
}

export default {
  seedUsersTable,
}
