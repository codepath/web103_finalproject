import { pool } from "../config/database.js";
import { getCurrentUserId } from "../helpers/currentUser.js";
import { isValidId, isValidDate, isValidBudget } from "../helpers/validation.js";
import { isDateBefore } from "../helpers/dates.js";

// GET /api/trips — list the current user's trips.
const getAllTrips = async (req, res) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { rows } = await pool.query(
      "SELECT * FROM trips WHERE user_id = $1 ORDER BY id ASC",
      [userId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/trips/:id — get one trip owned by the current user.
const getTripById = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid trip id" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { rows } = await pool.query(
      "SELECT * FROM trips WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    if (!rows.length) return res.status(404).json({ error: "Trip not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/trips — create a trip owned by the current user.
const createTrip = async (req, res) => {
  const { title, startDate, endDate, budget } = req.body;

  if (!title) return res.status(400).json({ error: "title is required" });
  if (startDate !== undefined && !isValidDate(startDate)) {
    return res.status(400).json({ error: "start_date is invalid" });
  }
  if (endDate !== undefined && !isValidDate(endDate)) {
    return res.status(400).json({ error: "end_date is invalid" });
  }
  if (budget !== undefined && !isValidBudget(budget)) {
    return res.status(400).json({ error: "budget is invalid" });
  }
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return res
      .status(400)
      .json({ error: "end_date cannot precede start_date" });
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { rows } = await pool.query(
      `INSERT INTO trips (user_id, title, start_date, end_date, budget)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, startDate, endDate, budget],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/trips/:id — edit a trip owned by the current user (only fields present in the body are changed).
const updateTrip = async (req, res) => {
  const { id } = req.params;
  const { title, startDate, endDate, budget } = req.body;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid trip id" });
  if (startDate !== undefined && !isValidDate(startDate)) {
    return res.status(400).json({ error: "start_date is invalid" });
  }
  if (endDate !== undefined && !isValidDate(endDate)) {
    return res.status(400).json({ error: "end_date is invalid" });
  }
  if (budget !== undefined && !isValidBudget(budget)) {
    return res.status(400).json({ error: "budget is invalid" });
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const existingTrip = await pool.query(
      "SELECT * FROM trips WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    if (!existingTrip.rows.length)
      return res.status(404).json({ error: "Trip not found" });

    // a PATCH can send either date, both, or neither; for whichever one isn't
    // sent, fall back to the trip's existing value, then validate that pair
    const mergedStartDate = startDate ?? existingTrip.rows[0].start_date;
    const mergedEndDate = endDate ?? existingTrip.rows[0].end_date;
    if (
      mergedStartDate &&
      mergedEndDate &&
      isDateBefore(mergedEndDate, mergedStartDate)
    ) {
      return res
        .status(400)
        .json({ error: "end_date cannot precede start_date" });
    }

    const { rows } = await pool.query(
      `UPDATE trips
       SET title = COALESCE($1, title),
           start_date = COALESCE($2, start_date),
           end_date = COALESCE($3, end_date),
           budget = COALESCE($4, budget)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, startDate, endDate, budget, id, userId],
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/trips/:id — delete a trip owned by the current user.
const deleteTrip = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid trip id" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { rows } = await pool.query(
      "DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId],
    );
    if (!rows.length) return res.status(404).json({ error: "Trip not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
