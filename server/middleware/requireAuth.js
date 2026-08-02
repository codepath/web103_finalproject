export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'You must be logged in' })
  }
  next()
}

export const requireAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}
