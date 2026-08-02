import { pool } from "../config/database.js";

// Destinations (and other trip-scoped resources) have no user_id of their own,
// so ownership must be checked by confirming the parent trip belongs to the user.
const getOwnedTrip = async (tripId, userId) => {
  const { rows } = await pool.query(
    "SELECT * FROM trips WHERE id = $1 AND user_id = $2",
    [tripId, userId],
  );
  return rows[0] ?? null;
};

export { getOwnedTrip };
