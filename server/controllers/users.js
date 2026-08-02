import { pool } from "../config/database.js";
import { getCurrentUserId } from "../helpers/currentUser.js";

// GET /api/users/me — get the current user's profile.
const getCurrentUser = async (req, res) => {
  const getQuery = "SELECT * FROM users WHERE id = $1";
  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { rows } = await pool.query(getQuery, [userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/users/me — update the current user's displayName and/or homeCurrency.
// This only updates the displayName and homeCurrency fields, since those are the only fields that are editable for a user in this app. If more fields are added to the user model in the future, this function should be updated to handle those fields (example password).
const updateCurrentUser = async (req, res) => {
  const { displayName, homeCurrency } = req.body;

  // To follow PATCH protocol, we use COALESCE to only update fields that are provided in the request body. If a field is not provided, it will retain its current value.
  const updateQuery = `
    UPDATE users
    SET display_name = COALESCE($1, display_name),
       home_currency = COALESCE($2, home_currency)
    WHERE id = $3
    RETURNING *
  `;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { rows } = await pool.query(updateQuery, [displayName, homeCurrency, userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getCurrentUser, updateCurrentUser };
