import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { pool } from '../config/database.js'

dotenv.config()

// Helper function to hash passwords
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Helper function to compare passwords
async function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

// Register a new user
export async function register(req, res) {
  const { username, password, email, full_name, phone_number } = req.body

  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    )
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await hashPassword(password)
    const newUser = await pool.query(
      'INSERT INTO users (username, password, email, full_name, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [username, hashedPassword, email, full_name, phone_number]
    )

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.rows[0].id,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Login an existing user
export async function login(req, res) {
  const { email, password } = req.body

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = userResult.rows[0]
    const validPassword = await comparePasswords(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    res.json({ message: 'Login successful', token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}
