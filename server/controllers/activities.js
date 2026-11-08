import pool from "../config/database.js";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Shared SELECT so every response has the same shape (vote data is added with the voting feature).
const ACTIVITY_SELECT = `
  SELECT a.id, a.trip_id, a.created_by_id, u.name AS created_by_name, a.title, a.location,
         a.scheduled_date, a.description, a.estimated_cost, a.created_at, a.updated_at
  FROM activities a JOIN users u ON u.id = a.created_by_id`;

function validateActivity(body, trip, { partial = false } = {}) {
  const values = {};
  if (body.title !== undefined || !partial) {
    const title = String(body.title ?? "").trim();
    if (!title) return { error: "Title is required." };
    values.title = title.slice(0, 200);
  }
  for (const key of ["location", "description"]) {
    if (body[key] !== undefined) {
      const text = String(body[key] ?? "").trim();
      values[key] = text ? text.slice(0, key === "location" ? 200 : 2000) : null;
    }
  }
  if (body.scheduled_date !== undefined) {
    const date = body.scheduled_date || null;
    if (date) {
      if (!DATE.test(date) || Number.isNaN(Date.parse(date))) {
        return { error: "Scheduled date must be a valid date." };
      }
      if (date < trip.start_date || date > trip.end_date) {
        return { error: "Scheduled date must fall within the trip dates." };
      }
    }
    values.scheduled_date = date;
  }
  if (body.estimated_cost !== undefined && body.estimated_cost !== "") {
    const cost = Number(body.estimated_cost);
    if (!Number.isFinite(cost) || cost < 0) return { error: "Estimated cost must be zero or more." };
    values.estimated_cost = cost;
  } else if (body.estimated_cost === "") {
    values.estimated_cost = 0;
  }
  return { values };
}

async function getTripDates(tripId) {
  const { rows } = await pool.query("SELECT start_date, end_date FROM trips WHERE id = $1", [tripId]);
  return rows[0];
}

export async function listActivities(req, res, next) {
  try {
    const { rows } = await pool.query(
      `${ACTIVITY_SELECT} WHERE a.trip_id = $1
       ORDER BY a.scheduled_date NULLS LAST, a.id`,
      [req.tripId],
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function createActivity(req, res, next) {
  try {
    const { values, error } = validateActivity(req.body, await getTripDates(req.tripId));
    if (error) return res.status(400).json({ error });
    const { rows } = await pool.query(
      `INSERT INTO activities (trip_id, created_by_id, title, location, scheduled_date, description, estimated_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [req.tripId, req.userId, values.title, values.location ?? null, values.scheduled_date ?? null,
        values.description ?? null, values.estimated_cost ?? 0],
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err) {
    next(err);
  }
}

// Loads the activity and the acting user's role on its trip, or responds 404/403.
export async function loadActivity(req, res, next) {
  try {
    const id = Number(req.params.activityId);
    const found = Number.isInteger(id)
      ? await pool.query(
          `SELECT a.id, a.trip_id, a.created_by_id, m.role
           FROM activities a LEFT JOIN trip_members m ON m.trip_id = a.trip_id AND m.user_id = $2
           WHERE a.id = $1`,
          [id, req.userId],
        )
      : { rowCount: 0 };
    if (found.rowCount === 0) return res.status(404).json({ error: "Activity not found." });
    if (!found.rows[0].role) {
      return res.status(403).json({ error: "You are not a member of this trip." });
    }
    req.activity = found.rows[0];
    next();
  } catch (error) {
    next(error);
  }
}

export async function getActivity(req, res, next) {
  try {
    const { rows } = await pool.query(`${ACTIVITY_SELECT} WHERE a.id = $1`, [req.activity.id]);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

function requireCreator(req, res) {
  if (req.activity.created_by_id !== req.userId) {
    res.status(403).json({ error: "You can only change activities you added." });
    return false;
  }
  return true;
}

export async function updateActivity(req, res, next) {
  if (!requireCreator(req, res)) return;
  try {
    const { values, error } = validateActivity(
      req.body,
      await getTripDates(req.activity.trip_id),
      { partial: true },
    );
    if (error) return res.status(400).json({ error });
    const keys = Object.keys(values);
    if (keys.length === 0) return res.status(400).json({ error: "Nothing to update." });
    const sets = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    await pool.query(
      `UPDATE activities SET ${sets}, updated_at = NOW() WHERE id = $1`,
      [req.activity.id, ...keys.map((key) => values[key])],
    );
    res.json({ id: req.activity.id });
  } catch (err) {
    next(err);
  }
}

export async function deleteActivity(req, res, next) {
  if (!requireCreator(req, res)) return;
  try {
    await pool.query("DELETE FROM activities WHERE id = $1", [req.activity.id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
