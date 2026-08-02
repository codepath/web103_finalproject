import { pool } from "../config/database.js";

// Activities have no user_id of their own; ownership is checked by walking
// up destination -> trip -> user through this two-level join.
const getOwnedActivity = async (activityId, userId) => {
  const { rows } = await pool.query(
    `SELECT activities.*
     FROM activities
     JOIN destinations ON activities.destination_id = destinations.id
     JOIN trips ON destinations.trip_id = trips.id
     WHERE activities.id = $1 AND trips.user_id = $2`,
    [activityId, userId],
  );
  return rows[0] ?? null;
};

export { getOwnedActivity };
