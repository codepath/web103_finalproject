import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function authenticateToken(req, res, next) {
  const token = req.headers['authorization']
  if (!token) return res.status(403).json({ error: 'Access denied' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}
