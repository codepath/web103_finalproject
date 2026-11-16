import express from 'express'
import { pool } from '../config/database.js'
import { requireAuth, ownershipError } from '../middleware/auth.js'

const router = express.Router()

// Options for the dashboard filter dropdowns
router.get('/activity-types', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name FROM activity_types ORDER BY name',
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/tags', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name FROM tags ORDER BY name')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/venues', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, city, owner_id FROM venues ORDER BY name',
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/venues/:id  only the venue's owner
router.delete('/venues/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid venue ID' })
  }

  const client = await pool.connect()
  let transactionOpen = false

  try {
    await client.query('BEGIN')
    transactionOpen = true

    const venue = await client.query(
      'SELECT owner_id FROM venues WHERE id = $1 FOR UPDATE',
      [id],
    )
    const denied = ownershipError(venue.rows[0]?.owner_id, req.user.id, 'Venue')
    if (denied) {
      await client.query('ROLLBACK')
      transactionOpen = false
      return res.status(denied.status).json({ error: denied.error })
    }

    const linkedEvents = await client.query(
      'SELECT COUNT(*)::integer AS count FROM events WHERE venue_id = $1',
      [id],
    )

    if (linkedEvents.rows[0].count > 0) {
      await client.query('ROLLBACK')
      transactionOpen = false

      return res.status(409).json({
        error: 'Cannot delete a venue with associated events.',
        event_count: linkedEvents.rows[0].count,
      })
    }

    await client.query('DELETE FROM venues WHERE id = $1', [id])
    await client.query('COMMIT')
    transactionOpen = false

    return res.status(204).end()
  } catch (error) {
    if (transactionOpen) {
      try {
        await client.query('ROLLBACK')
      } catch (rollbackError) {
        console.error('Venue delete rollback failed:', rollbackError)
      }
    }

    if (error.code === '23503') {
      return res.status(409).json({
        error: 'Cannot delete venue because it is still referenced.',
      })
    }

    console.error('Venue deletion failed:', error)
    return res.status(500).json({
      error: 'Unable to delete venue.',
    })
  } finally {
    client.release()
  }
})

// Low-volume, user-triggered geocoding for US venues.
// Public Nominatim is not an autocomplete service.
const geocodeCache = new Map()
let lastGeocodeRequest = 0

router.get('/geocode', async (req, res) => {
  const address =
    typeof req.query.address === 'string' ? req.query.address.trim() : ''
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : ''

  if (!address || !city || address.length > 200 || city.length > 100) {
    return res.status(400).json({
      error: 'A valid street address and city are required.',
    })
  }

  const state =
    typeof req.query.state === 'string'
      ? req.query.state.trim().toUpperCase()
      : ''
  const zip =
    typeof req.query.zip_code === 'string' ? req.query.zip_code.trim() : ''

  const validStates = new Set(
    'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(
      ' ',
    ),
  )

  if (!validStates.has(state) || (zip && !/^\d{5}(-\d{4})?$/.test(zip))) {
    return res.status(400).json({
      error: 'Choose a valid US state and ZIP code.',
    })
  }
  const key = `${address}, ${city}, ${state}, ${zip}`.toLowerCase()
  const cached = geocodeCache.get(key)

  if (cached) return res.json(cached)

  // Respect the public service's maximum of one request per second.
  if (Date.now() - lastGeocodeRequest < 1100) {
    return res.status(429).json({
      error: 'Please wait a moment before trying another address.',
    })
  }

  lastGeocodeRequest = Date.now()

  try {
    const params = new URLSearchParams({
      q: `${address}, ${city}, ${state}${zip ? ` ${zip}` : ''}, USA`,
      format: 'jsonv2',
      limit: '1',
    })

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'User-Agent': 'LocalBloom-Web103/1.0 (educational venue lookup)',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      },
    )

    if (!response.ok) {
      throw new Error('Geocoding service unavailable')
    }

    const results = await response.json()

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(404).json({
        error: 'Address not found. You can enter coordinates manually.',
      })
    }

    const latitude = Number(results[0].lat)
    const longitude = Number(results[0].lon)

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error('Invalid geocoding result')
    }

    const coordinates = { latitude, longitude }

    geocodeCache.set(key, coordinates)
    res.json(coordinates)
  } catch {
    res.status(502).json({
      error: 'GPS lookup unavailable. You can enter coordinates manually.',
    })
  }
})
export default router
