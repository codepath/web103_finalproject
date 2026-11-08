import pool from "../config/database.js";

export async function joinTrip(req, res, next) {
  const code = String(req.body.invite_code || "").trim();
  if (!code) return res.status(400).json({ error: "Enter an invite code." });
  try {
    const trip = await pool.query(
      "SELECT id FROM trips WHERE upper(invite_code) = upper($1)",
      [code],
    );
    if (trip.rowCount === 0) {
      return res.status(404).json({ error: "No trip matches that invite code." });
    }
    const tripId = trip.rows[0].id;
    const result = await pool.query(
      `INSERT INTO trip_members (trip_id, user_id, role) VALUES ($1, $2, 'member')
       ON CONFLICT (trip_id, user_id) DO NOTHING`,
      [tripId, req.userId],
    );
    if (result.rowCount === 0) {
      return res.status(409).json({ error: "You are already a member of that trip.", id: tripId });
    }
    res.status(201).json({ id: tripId });
  } catch (error) {
    next(error);
  }
}

export async function listMembers(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT u.id AS user_id, u.name, m.role, m.joined_at
       FROM trip_members m JOIN users u ON u.id = m.user_id
       WHERE m.trip_id = $1
       ORDER BY (m.role = 'organizer') DESC, m.joined_at, u.id`,
      [req.tripId],
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}
