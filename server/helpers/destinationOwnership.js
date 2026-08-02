import { pool } from "../config/database.js";

// Destinations have no user_id of their own; ownership is checked via the parent trip through this join.
// Shared by any resource scoped through a destination (activities via destination -> trip).
const getOwnedDestination = async (destinationId, userId) => {
  const { rows } = await pool.query(
    `SELECT destinations.*
     FROM destinations
     JOIN trips ON destinations.trip_id = trips.id
     WHERE destinations.id = $1 AND trips.user_id = $2`,
    [destinationId, userId],
  );
  return rows[0] ?? null;
};

export { getOwnedDestination };
