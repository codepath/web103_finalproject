// req.user is set by Passport once GitHub login is wired up (separate issue).
// Until then every write route returns 401.
export function requireAuth(req, res, next) {
  if (!req.user)
    return res.status(401).json({ error: 'You must be logged in to do that' })
  next()
}

// ownerId: the row's created_by/owner_id, or undefined when the row doesn't exist.
// Returns { status, error } to send, or null when the user owns it.
export function ownershipError(ownerId, userId, label) {
  if (ownerId === undefined) return { status: 404, error: `${label} not found` }
  if (ownerId !== userId)
    return {
      status: 403,
      error: `Only the creator can change this ${label.toLowerCase()}`,
    }
  return null
}
