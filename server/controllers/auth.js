import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/database.js'

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    // Check if user already exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create new user with default goals
    const result = await pool.query(
      `INSERT INTO users (email, password, name, goal, calorie_target, protein_target, carb_target, fat_target) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, email, name, goal, calorie_target, protein_target, carb_target, fat_target`,
      [email, hashedPassword, name, 'maintain', 2000, 150, 200, 65]
    )
    
    const user = result.rows[0]
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    )
    
    res.status(201).json({ user, token })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed: ' + error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const user = result.rows[0]
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    )
    
    // Remove password from response
    delete user.password
    
    res.json({ user, token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed: ' + error.message })
  }
}

export default { register, login }