import { pool } from "../config/database.js";

// Single source of truth for "who is the current user."
// No auth yet, so this resolves to the one seeded user.
// It is used extensively in the controllers to ensure that all operations are scoped to the current user

// TODO: once auth exists, resolve the user id from the session/token instead.
const getCurrentUserId = async () => {
  const { rows } = await pool.query(
    "SELECT id FROM users ORDER BY id ASC LIMIT 1",
  );
  return rows[0]?.id;
};

export { getCurrentUserId };
