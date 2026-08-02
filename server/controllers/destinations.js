import { pool } from "../config/database.js";
import { getCurrentUserId } from "../helpers/currentUser.js";
import { getOwnedTrip } from "../helpers/tripOwnership.js";
import { getOwnedDestination } from "../helpers/destinationOwnership.js";
import { getCurrencyForCountry } from "../helpers/currency.js";
import { isValidId, isValidDate } from "../helpers/validation.js";
import { isDateBefore, isDateAfter } from "../helpers/dates.js";

// GET /api/trips/:tripId/destinations — list a trip's destinations, ordered for a multi-stop itinerary.
const getDestinationsForTrip = async (req, res) => {
  const { tripId } = req.params;
  if (!isValidId(tripId)) return res.status(400).json({ error: "Invalid trip id" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const trip = await getOwnedTrip(tripId, userId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const { rows } = await pool.query(
      `SELECT * FROM destinations
       WHERE trip_id = $1
       ORDER BY arrival_order ASC NULLS LAST, start_date ASC NULLS LAST`,
      [tripId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/trips/:tripId/destinations — add a destination to a trip; currency_code is derived from country.
const createDestination = async (req, res) => {
  const { tripId } = req.params;
  const { city, country, startDate, endDate, arrivalOrder } = req.body;

  if (!isValidId(tripId)) return res.status(400).json({ error: "Invalid trip id" });
  if (!city) return res.status(400).json({ error: "city is required" });
  if (!country) return res.status(400).json({ error: "country is required" });
  if (startDate !== undefined && !isValidDate(startDate)) {
    return res.status(400).json({ error: "start_date is invalid" });
  }
  if (endDate !== undefined && !isValidDate(endDate)) {
    return res.status(400).json({ error: "end_date is invalid" });
  }
  if (arrivalOrder !== undefined && Number.isNaN(Number(arrivalOrder))) {
    return res.status(400).json({ error: "arrival_order is invalid" });
  }
  if (startDate && endDate && isDateBefore(endDate, startDate)) {
    return res.status(400).json({ error: "end_date cannot precede start_date" });
  }

  // country is a free-text country name, e.g. "United States" -> resolves to "USD" via data/countryCurrency.js
  const currencyCode = getCurrencyForCountry(country);
  if (!currencyCode) return res.status(400).json({ error: "Unknown country" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const trip = await getOwnedTrip(tripId, userId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    // reject destination dates that fall outside the parent trip's range
    if (trip.start_date && startDate && isDateBefore(startDate, trip.start_date)) {
      return res.status(400).json({ error: "start_date falls before the trip's start_date" });
    }
    if (trip.end_date && endDate && isDateAfter(endDate, trip.end_date)) {
      return res.status(400).json({ error: "end_date falls after the trip's end_date" });
    }

    const { rows } = await pool.query(
      `INSERT INTO destinations (trip_id, city, country, currency_code, arrival_order, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [tripId, city, country, currencyCode, arrivalOrder, startDate, endDate],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/destinations/:id — get one destination owned (via its trip) by the current user.
const getDestinationById = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid destination id" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const destination = await getOwnedDestination(id, userId);
    if (!destination) return res.status(404).json({ error: "Destination not found" });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/destinations/:id — edit a destination owned (via its trip) by the current user.
const updateDestination = async (req, res) => {
  const { id } = req.params;
  const { city, country, startDate, endDate, arrivalOrder } = req.body;

  if (!isValidId(id)) return res.status(400).json({ error: "Invalid destination id" });
  if (startDate !== undefined && !isValidDate(startDate)) {
    return res.status(400).json({ error: "start_date is invalid" });
  }
  if (endDate !== undefined && !isValidDate(endDate)) {
    return res.status(400).json({ error: "end_date is invalid" });
  }
  if (arrivalOrder !== undefined && Number.isNaN(Number(arrivalOrder))) {
    return res.status(400).json({ error: "arrival_order is invalid" });
  }

  // country is a free-text country name, e.g. "United States" -> resolves to "USD" via data/countryCurrency.js
  // only re-derive currency_code if the caller is actually changing the country
  let currencyCode;
  if (country !== undefined) {
    currencyCode = getCurrencyForCountry(country);
    if (!currencyCode) return res.status(400).json({ error: "Unknown country" });
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const existingDestination = await getOwnedDestination(id, userId);
    if (!existingDestination) return res.status(404).json({ error: "Destination not found" });

    const trip = await getOwnedTrip(existingDestination.trip_id, userId);

    // a PATCH can send either date, both, or neither; for whichever one isn't
    // sent, fall back to the destination's existing value, then validate that pair
    const mergedStartDate = startDate ?? existingDestination.start_date;
    const mergedEndDate = endDate ?? existingDestination.end_date;
    if (mergedStartDate && mergedEndDate && isDateBefore(mergedEndDate, mergedStartDate)) {
      return res.status(400).json({ error: "end_date cannot precede start_date" });
    }
    if (trip.start_date && mergedStartDate && isDateBefore(mergedStartDate, trip.start_date)) {
      return res.status(400).json({ error: "start_date falls before the trip's start_date" });
    }
    if (trip.end_date && mergedEndDate && isDateAfter(mergedEndDate, trip.end_date)) {
      return res.status(400).json({ error: "end_date falls after the trip's end_date" });
    }

    const { rows } = await pool.query(
      `UPDATE destinations
       SET city = COALESCE($1, city),
           country = COALESCE($2, country),
           currency_code = COALESCE($3, currency_code),
           arrival_order = COALESCE($4, arrival_order),
           start_date = COALESCE($5, start_date),
           end_date = COALESCE($6, end_date)
       WHERE id = $7
       RETURNING *`,
      [city, country, currencyCode, arrivalOrder, startDate, endDate, id],
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/destinations/:id — delete a destination owned (via its trip) by the current user.
const deleteDestination = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid destination id" });

  try {
    const userId = await getCurrentUserId();
    if (!userId) return res.status(404).json({ error: "User not found" });

    const destination = await getOwnedDestination(id, userId);
    if (!destination) return res.status(404).json({ error: "Destination not found" });

    await pool.query("DELETE FROM destinations WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getDestinationsForTrip,
  createDestination,
  getDestinationById,
  updateDestination,
  deleteDestination,
};
