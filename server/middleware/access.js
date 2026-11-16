import pool from "../config/database.js";

// Loads the acting user's role on the trip into req.role, or responds 404/403.
export async function requireMember(req, res, next) {
  try {
    const tripId = Number(req.params.tripId);
    if (!Number.isInteger(tripId)) return res.status(404).json({ error: "Trip not found." });
    const trip = await pool.query("SELECT 1 FROM trips WHERE id = $1", [tripId]);
    if (trip.rowCount === 0) return res.status(404).json({ error: "Trip not found." });
    const member = await pool.query(
      "SELECT role FROM trip_members WHERE trip_id = $1 AND user_id = $2",
      [tripId, req.userId],
    );
    if (member.rowCount === 0) {
      return res.status(403).json({ error: "You are not a member of this trip." });
    }
    req.tripId = tripId;
    req.role = member.rows[0].role;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireOrganizer(req, res, next) {
  if (req.role !== "organizer") {
    return res.status(403).json({ error: "Only the trip organizer can do that." });
  }
  next();
}
