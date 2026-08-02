import { pool } from "../config/database.js";
import { getCurrentUserId } from "../helpers/currentUser.js";
import { getOwnedDestination } from "../helpers/destinationOwnership.js";
import { getOwnedActivity } from "../helpers/activityOwnership.js";
import { isValidId, isValidDate, isValidTime } from "../helpers/validation.js";
import { isDateBefore, isDateAfter } from "../helpers/dates.js";

// GET /api/destinations/:destinationId/activities — list a destination's activities;
// the frontend splits scheduled vs unscheduled by whether scheduled_date is null.
const getActivitiesForDestination = async (req, res) => {
  const { destinationId } = req.params;
  if (!isValidId(destinationId)) return res.status(400).json({ error: "Invalid destination id" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const destination = await getOwnedDestination(destinationId, userId);
    if (!destination) return res.status(404).json({ error: "Destination not found" });

    const { rows } = await pool.query(
      "SELECT * FROM activities WHERE destination_id = $1 ORDER BY scheduled_date ASC NULLS LAST, start_time ASC NULLS LAST",
      [destinationId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/destinations/:destinationId/activities — add an activity to a destination.
const createActivity = async (req, res) => {
  const { destinationId } = req.params;
  const { name, scheduledDate, startTime, durationMinutes, notes } = req.body;

  if (!isValidId(destinationId)) return res.status(400).json({ error: "Invalid destination id" });
  if (!name) return res.status(400).json({ error: "name is required" });
  if (scheduledDate !== undefined && scheduledDate !== null && !isValidDate(scheduledDate)) {
    return res.status(400).json({ error: "scheduled_date is invalid" });
  }
  if (startTime !== undefined && startTime !== null && !isValidTime(startTime)) {
    return res.status(400).json({ error: "start_time is invalid" });
  }
  if (durationMinutes !== undefined && Number.isNaN(Number(durationMinutes))) {
    return res.status(400).json({ error: "duration_minutes is invalid" });
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const destination = await getOwnedDestination(destinationId, userId);
    if (!destination) return res.status(404).json({ error: "Destination not found" });

    // reject a scheduled_date that falls outside the parent destination's range
    if (scheduledDate) {
      if (destination.start_date && isDateBefore(scheduledDate, destination.start_date)) {
        return res.status(400).json({ error: "scheduled_date falls before the destination's start_date" });
      }
      if (destination.end_date && isDateAfter(scheduledDate, destination.end_date)) {
        return res.status(400).json({ error: "scheduled_date falls after the destination's end_date" });
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO activities (destination_id, name, scheduled_date, start_time, duration_minutes, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [destinationId, name, scheduledDate, startTime, durationMinutes, notes],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/activities/:id — get one activity owned (via destination -> trip) by the current user.
const getActivityById = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid activity id" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const activity = await getOwnedActivity(id, userId);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/activities/:id — edit an activity; setting scheduled_date schedules it,
// explicitly setting it to null unschedules it. No separate schedule/unschedule endpoints.
const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { name, startTime, durationMinutes, notes } = req.body;
  const scheduledDate = req.body.scheduledDate;
  const hasScheduledDate = "scheduledDate" in req.body;

  if (!isValidId(id)) return res.status(400).json({ error: "Invalid activity id" });
  if (hasScheduledDate && scheduledDate !== null && !isValidDate(scheduledDate)) {
    return res.status(400).json({ error: "scheduled_date is invalid" });
  }
  if (startTime !== undefined && startTime !== null && !isValidTime(startTime)) {
    return res.status(400).json({ error: "start_time is invalid" });
  }
  if (durationMinutes !== undefined && Number.isNaN(Number(durationMinutes))) {
    return res.status(400).json({ error: "duration_minutes is invalid" });
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const existingActivity = await getOwnedActivity(id, userId);
    if (!existingActivity) return res.status(404).json({ error: "Activity not found" });

    // only validate against the destination's range when actually setting a scheduled_date (not clearing it)
    if (hasScheduledDate && scheduledDate) {
      const destination = await getOwnedDestination(existingActivity.destination_id, userId);
      if (destination.start_date && isDateBefore(scheduledDate, destination.start_date)) {
        return res.status(400).json({ error: "scheduled_date falls before the destination's start_date" });
      }
      if (destination.end_date && isDateAfter(scheduledDate, destination.end_date)) {
        return res.status(400).json({ error: "scheduled_date falls after the destination's end_date" });
      }
    }

    const { rows } = await pool.query(
      `UPDATE activities
       SET name = COALESCE($1, name),
           scheduled_date = CASE WHEN $2 THEN $3 ELSE scheduled_date END,
           start_time = COALESCE($4, start_time),
           duration_minutes = COALESCE($5, duration_minutes),
           notes = COALESCE($6, notes)
       WHERE id = $7
       RETURNING *`,
      [name, hasScheduledDate, scheduledDate, startTime, durationMinutes, notes, id],
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/activities/:id — delete an activity owned (via destination -> trip) by the current user.
const deleteActivity = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid activity id" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const activity = await getOwnedActivity(id, userId);
    if (!activity) return res.status(404).json({ error: "Activity not found" });

    await pool.query("DELETE FROM activities WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getActivitiesForDestination,
  createActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
};
