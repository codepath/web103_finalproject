import { randomBytes } from "node:crypto";
import pool from "../config/database.js";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Returns { values } for valid input or { error } describing the first problem.
function validateTrip(body, { partial = false } = {}) {
  const values = {};
  const text = (key, label) => {
    if (body[key] === undefined) return partial ? null : `${label} is required.`;
    const value = String(body[key]).trim();
    if (!value) return `${label} is required.`;
    values[key] = value.slice(0, 200);
    return null;
  };
  const date = (key, label) => {
    if (body[key] === undefined) return partial ? null : `${label} is required.`;
    if (!DATE.test(body[key]) || Number.isNaN(Date.parse(body[key]))) {
      return `${label} must be a valid date.`;
    }
    values[key] = body[key];
    return null;
  };
  const budget = () => {
    if (body.budget === undefined || body.budget === "") {
      return partial ? null : "Budget is required.";
    }
    const amount = Number(body.budget);
    if (!Number.isFinite(amount) || amount < 0) return "Budget must be zero or more.";
    values.budget = amount;
    return null;
  };
  const error =
    text("title", "Title") ||
    text("destination", "Destination") ||
    date("start_date", "Start date") ||
    date("end_date", "End date") ||
    budget();
  return error ? { error } : { values };
}

const TRIP_COLUMNS = `t.id, t.title, t.destination, t.start_date, t.end_date, t.budget,
  t.invite_code, t.organizer_id, t.created_at, t.updated_at`;

export async function listTrips(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT ${TRIP_COLUMNS}, m.role,
        (SELECT COUNT(*)::int FROM trip_members WHERE trip_id = t.id) AS member_count
       FROM trips t JOIN trip_members m ON m.trip_id = t.id AND m.user_id = $1
       ORDER BY t.start_date, t.id`,
      [req.userId],
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function createTrip(req, res, next) {
  const { values, error } = validateTrip(req.body);
  if (error) return res.status(400).json({ error });
  if (values.start_date > values.end_date) {
    return res.status(400).json({ error: "End date must be on or after the start date." });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const trip = await client.query(
      `INSERT INTO trips (organizer_id, title, destination, start_date, end_date, budget, invite_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [req.userId, values.title, values.destination, values.start_date, values.end_date,
        values.budget, randomBytes(4).toString("hex").toUpperCase()],
    );
    await client.query(
      "INSERT INTO trip_members (trip_id, user_id, role) VALUES ($1, $2, 'organizer')",
      [trip.rows[0].id, req.userId],
    );
    await client.query("COMMIT");
    res.status(201).json({ id: trip.rows[0].id });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

export async function getTrip(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT ${TRIP_COLUMNS},
        (SELECT COUNT(*)::int FROM trip_members WHERE trip_id = t.id) AS member_count
       FROM trips t WHERE t.id = $1`,
      [req.tripId],
    );
    res.json({ ...rows[0], role: req.role });
  } catch (error) {
    next(error);
  }
}

export async function updateTrip(req, res, next) {
  const { values, error } = validateTrip(req.body, { partial: true });
  if (error) return res.status(400).json({ error });
  const keys = Object.keys(values);
  if (keys.length === 0) return res.status(400).json({ error: "Nothing to update." });
  try {
    const sets = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    await pool.query(
      `UPDATE trips SET ${sets}, updated_at = NOW() WHERE id = $1`,
      [req.tripId, ...keys.map((key) => values[key])],
    );
    res.json({ id: req.tripId });
  } catch (err) {
    // 23514 is the CHECK violation for start_date <= end_date.
    if (err.code === "23514") {
      return res.status(400).json({ error: "End date must be on or after the start date." });
    }
    next(err);
  }
}

export async function deleteTrip(req, res, next) {
  try {
    await pool.query("DELETE FROM trips WHERE id = $1", [req.tripId]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
