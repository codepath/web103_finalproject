import pool from "../config/database.js";

// The demo user selector sends the active user's id. This is not authentication.
export default async function actingUser(req, res, next) {
  const id = Number(req.get("x-user-id"));
  if (!Number.isInteger(id) || id < 1) {
    return res.status(401).json({ error: "Select a demo user first." });
  }
  try {
    const { rowCount } = await pool.query("SELECT 1 FROM users WHERE id = $1", [id]);
    if (rowCount === 0) return res.status(401).json({ error: "Unknown demo user." });
    req.userId = id;
    next();
  } catch (error) {
    next(error);
  }
}
