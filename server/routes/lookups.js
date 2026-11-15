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

const VENUE_COLUMNS =
  'id, owner_id, name, address, city, latitude, longitude, website_url, hours'

// Returns an error message, or null when the venue body is valid.
// latitude/longitude/website_url/hours are optional; send null or '' to clear them.
export function validateVenue(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return 'Venue details are required'
  const { name, address, city, latitude, longitude, website_url, hours } = body

  for (const [field, value, max] of [
    ['name', name, 120],
    ['address', address, 200],
    ['city', city, 100],
  ]) {
    if (typeof value !== 'string' || !value.trim())
      return `${field} is required`
    if (value.trim().length > max)
      return `${field} must be ${max} characters or fewer`
  }

  const blank = (v) => v === undefined || v === null || v === ''
  if (blank(latitude) !== blank(longitude))
    return 'Provide both latitude and longitude, or neither'
  if (!blank(latitude)) {
    const lat = Number(latitude)
    const lng = Number(longitude)
    if (!Number.isFinite(lat) || lat < -90 || lat > 90)
      return 'latitude must be a number between -90 and 90'
    if (!Number.isFinite(lng) || lng < -180 || lng > 180)
      return 'longitude must be a number between -180 and 180'
  }

  if (!blank(website_url)) {
    if (typeof website_url !== 'string') return 'website_url must be a string'
    try {
      const url = new URL(website_url.trim())
      if (url.protocol !== 'https:' && url.protocol !== 'http:')
        return 'website_url must start with https:// or http://'
    } catch {
      return 'website_url must be a valid URL'
    }
  }

  if (!blank(hours) && (typeof hours !== 'string' || hours.trim().length > 200))
    return 'hours must be text of 200 characters or fewer'

  return null
}

// Normalized values in column order: name, address, city, latitude, longitude, website_url, hours
function venueValues(body) {
  const text = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null)
  const num = (v) =>
    v === undefined || v === null || v === '' ? null : Number(v)
  return [
    body.name.trim(),
    body.address.trim(),
    body.city.trim(),
    num(body.latitude),
    num(body.longitude),
    text(body.website_url),
    text(body.hours),
  ]
}

const parseVenueId = (raw) => {
  const id = Number(raw)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

// GET /api/venues/mine  venues owned by the logged-in user, for the management page
router.get('/venues/mine', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${VENUE_COLUMNS},
         (SELECT COUNT(*)::integer FROM events e WHERE e.venue_id = venues.id) AS event_count
       FROM venues WHERE owner_id = $1 ORDER BY name`,
      [req.user.id],
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/venues/:id', async (req, res) => {
  const id = parseVenueId(req.params.id)
  if (!id) return res.status(400).json({ error: 'Invalid venue ID' })
  try {
    const { rows } = await pool.query(
      `SELECT ${VENUE_COLUMNS} FROM venues WHERE id = $1`,
      [id],
    )
    if (!rows.length) return res.status(404).json({ error: 'Venue not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/venues  the logged-in user becomes the owner
router.post('/venues', requireAuth, async (req, res) => {
  const error = validateVenue(req.body)
  if (error) return res.status(400).json({ error })
  try {
    const { rows } = await pool.query(
      `INSERT INTO venues (owner_id, name, address, city, latitude, longitude, website_url, hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${VENUE_COLUMNS}`,
      [req.user.id, ...venueValues(req.body)],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/venues/:id  full replace, owner only. The id never changes, so linked events keep their venue.
router.put('/venues/:id', requireAuth, async (req, res) => {
  const id = parseVenueId(req.params.id)
  if (!id) return res.status(400).json({ error: 'Invalid venue ID' })
  const error = validateVenue(req.body)
  if (error) return res.status(400).json({ error })

  try {
    const existing = await pool.query(
      'SELECT owner_id FROM venues WHERE id = $1',
      [id],
    )
    const denied = ownershipError(
      existing.rows[0]?.owner_id,
      req.user.id,
      'Venue',
    )
    if (denied) return res.status(denied.status).json({ error: denied.error })

    // owner_id in the WHERE too, so ownership can't change between the check and the update
    const { rows } = await pool.query(
      `UPDATE venues SET name = $3, address = $4, city = $5, latitude = $6,
         longitude = $7, website_url = $8, hours = $9
       WHERE id = $1 AND owner_id = $2
       RETURNING ${VENUE_COLUMNS}`,
      [id, req.user.id, ...venueValues(req.body)],
    )
    if (!rows.length) return res.status(404).json({ error: 'Venue not found' })
    res.json(rows[0])
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
