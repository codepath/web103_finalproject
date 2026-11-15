import express from 'express'
import { pool } from '../config/database.js'
import { requireAuth, ownershipError } from '../middleware/auth.js'

function validateImageUrl(imageUrl) {
  if (imageUrl === undefined || imageUrl === null || imageUrl === '')
    return null
  if (typeof imageUrl !== 'string') return 'Picture URL must be a string'

  const value = imageUrl.trim()
  if (!value) return null

  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return 'Picture URL must start with https:// or http://'
    }
    if (!parsed.hostname) return 'Picture URL must contain a hostname'
  } catch {
    return 'Picture URL must be a valid URL'
  }

  return null
}

async function saveCoverImage(client, eventId, imageUrl) {
  if (imageUrl === undefined) return

  const value = typeof imageUrl === 'string' ? imageUrl.trim() : ''

  // Only manage the cover image. Preserve any gallery images.
  await client.query(
    'DELETE FROM event_images WHERE event_id = $1 AND position = 0',
    [eventId],
  )

  if (value) {
    await client.query(
      'INSERT INTO event_images (event_id, url, position) VALUES ($1, $2, 0)',
      [eventId, value],
    )
  }
}
const router = express.Router()

const eventQuery = `
  SELECT e.*,
    v.name AS venue_name, v.address, v.city, v.hours, v.website_url, v.latitude, v.longitude,
    a.name AS activity_type,
    COALESCE(array_agg(t.name ORDER BY t.name) FILTER (WHERE t.id IS NOT NULL), '{}') AS tags,
    ARRAY(SELECT url FROM event_images WHERE event_id = e.id ORDER BY position) AS images
  FROM events e
  JOIN venues v ON v.id = e.venue_id
  JOIN activity_types a ON a.id = e.activity_type_id
  LEFT JOIN event_tags et ON et.event_id = e.id
  LEFT JOIN tags t ON t.id = et.tag_id
`

// Keep in sync with priceTier() in client/src/format.js
const tierRanges = {
  free: 'e.price = 0',
  $: 'e.price > 0 AND e.price < 25',
  $$: 'e.price >= 25 AND e.price < 60',
  $$$: 'e.price >= 60',
}

// GET /api/events?activity_type=Workshop&tier=$$&tag=pottery (all optional, combined with AND)
router.get('/', async (req, res) => {
  const { activity_type, tier, tag } = req.query
  const where = []
  const params = []

  if (tier !== undefined) {
    if (!tierRanges[tier])
      return res
        .status(400)
        .json({ error: 'tier must be one of: free, $, $$, $$$' })
    where.push(tierRanges[tier])
  }
  if (activity_type) {
    params.push(activity_type)
    where.push(`a.name = $${params.length}`)
  }
  if (tag) {
    // Subquery so the matching event still returns all of its tags, not just the filtered one
    params.push(tag)
    where.push(
      `e.id IN (SELECT et2.event_id FROM event_tags et2 JOIN tags t2 ON t2.id = et2.tag_id WHERE t2.name = $${params.length})`,
    )
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  try {
    const { rows } = await pool.query(
      `${eventQuery} ${whereSql} GROUP BY e.id, v.id, a.id ORDER BY e.start_time`,
      params,
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id))
    return res.status(400).json({ error: 'Event id must be an integer' })

  try {
    const { rows } = await pool.query(
      `${eventQuery} WHERE e.id = $1 GROUP BY e.id, v.id, a.id`,
      [id],
    )
    if (!rows.length) return res.status(404).json({ error: 'Event not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Basic checks only; stricter validation (URLs, address format) is a separate issue
async function resolveVenueId(client, venueId, newVenue, ownerId) {
  if (newVenue == null) return venueId

  const name = newVenue.name.trim()
  const address = `${newVenue.address.trim()}, ${newVenue.state}${newVenue.zip_code ? ` ${newVenue.zip_code}` : ''}`
  const city = newVenue.city.trim()

  // Serialize venue creation through this application.
  // The lock is automatically released when the event transaction ends.
  await client.query('SELECT pg_advisory_xact_lock($1, $2)', [12031, 45001])

  // Normalize casing and repeated whitespace when comparing venue identity.
  const existing = await client.query(
    `SELECT id
     FROM venues
     WHERE LOWER(REGEXP_REPLACE(BTRIM(name), '[[:space:]]+', ' ', 'g')) =
           LOWER(REGEXP_REPLACE(BTRIM($1::text), '[[:space:]]+', ' ', 'g'))
       AND LOWER(REGEXP_REPLACE(BTRIM(address), '[[:space:]]+', ' ', 'g')) =
           LOWER(REGEXP_REPLACE(BTRIM($2::text), '[[:space:]]+', ' ', 'g'))
       AND LOWER(REGEXP_REPLACE(BTRIM(city), '[[:space:]]+', ' ', 'g')) =
           LOWER(REGEXP_REPLACE(BTRIM($3::text), '[[:space:]]+', ' ', 'g'))
     ORDER BY id
     LIMIT 1`,
    [name, address, city],
  )

  if (existing.rowCount > 0) {
    return existing.rows[0].id
  }

  const {
    rows: [venue],
  } = await client.query(
    `INSERT INTO venues
       (owner_id, name, address, city, website_url, latitude, longitude)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      ownerId,
      name,
      address,
      city,
      newVenue.website_url || null,
      newVenue.latitude ?? null,
      newVenue.longitude ?? null,
    ],
  )

  return venue.id
}
// PATCH: fields missing from the body keep the event's current values.
// pg returns NUMERIC as a string, so price is turned back into a number for validateEvent.
export function mergeEventPatch(existing, body) {
  return { ...existing, price: Number(existing.price), ...body }
}

export function validateEvent(body) {
  const {
    venue_id,
    activity_type_id,
    title,
    start_time,
    end_time,
    price = 0,
    tag_ids = [],
  } = body
  if (body.new_venue != null) {
    const v = body.new_venue

    if (
      typeof v !== 'object' ||
      Array.isArray(v) ||
      typeof v.name !== 'string' ||
      !v.name.trim() ||
      typeof v.address !== 'string' ||
      !v.address.trim() ||
      typeof v.city !== 'string' ||
      !v.city.trim() ||
      typeof v.state !== 'string' ||
      !/^(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)$/.test(
        v.state,
      ) ||
      (v.zip_code != null &&
        (typeof v.zip_code !== 'string' ||
          (v.zip_code !== '' && !/^\d{5}(-\d{4})?$/.test(v.zip_code))))
    ) {
      return 'New venue requires name, street address, and city'
    }

    if (
      v.website_url != null &&
      (typeof v.website_url !== 'string' ||
        !/^https?:\/\/[^/\s]+\.[^/\s]+/i.test(v.website_url))
    ) {
      return 'Invalid venue website URL'
    }

    if (
      v.latitude != null &&
      (typeof v.latitude !== 'number' ||
        !Number.isFinite(v.latitude) ||
        Math.abs(v.latitude) > 90)
    ) {
      return 'Invalid latitude'
    }

    if (
      v.longitude != null &&
      (typeof v.longitude !== 'number' ||
        !Number.isFinite(v.longitude) ||
        Math.abs(v.longitude) > 180)
    ) {
      return 'Invalid longitude'
    }
  } else if (!Number.isInteger(venue_id)) {
    return 'venue_id must be an integer'
  }
  if (!Number.isInteger(activity_type_id))
    return 'activity_type_id must be an integer'
  if (typeof title !== 'string' || !title.trim()) return 'title is required'
  const start = Date.parse(start_time)
  const end = Date.parse(end_time)
  if (Number.isNaN(start) || Number.isNaN(end))
    return 'start_time and end_time must be valid dates'
  if (end <= start) return 'end_time must be after start_time'
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0)
    return 'price must be a number >= 0'
  if (!Array.isArray(tag_ids) || !tag_ids.every(Number.isInteger))
    return 'tag_ids must be an array of integers'
  return null
}

// POST /api/events  body: { venue_id, activity_type_id, title, description, what_to_bring, start_time, end_time, price, tag_ids: [1, 2] }
router.post('/', requireAuth, async (req, res) => {
  const error = validateEvent(req.body ?? {})
  if (error) return res.status(400).json({ error })

  const imageError = validateImageUrl(req.body?.image_url)
  if (imageError) return res.status(400).json({ error: imageError })

  const {
    venue_id,
    new_venue,
    activity_type_id,
    title,
    description = null,
    what_to_bring = null,
    start_time,
    end_time,
    price = 0,
    tag_ids = [],
  } = req.body
  const client = await pool.connect()

  try {
    // Event row and its tag links succeed or fail together
    await client.query('BEGIN')
    const resolvedVenueId = await resolveVenueId(
      client,
      venue_id,
      new_venue,
      req.user.id,
    )
    const {
      rows: [{ id }],
    } = await client.query(
      `INSERT INTO events (venue_id, activity_type_id, title, description, what_to_bring, start_time, end_time, price, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        resolvedVenueId,
        activity_type_id,
        title.trim(),
        description,
        what_to_bring,
        start_time,
        end_time,
        price,
        req.user.id,
      ],
    )
    await client.query(
      'INSERT INTO event_tags (event_id, tag_id) SELECT $1, unnest($2::int[])',
      [id, [...new Set(tag_ids)]],
    )
    await saveCoverImage(client, id, req.body.image_url)

    await client.query('COMMIT')

    const { rows } = await pool.query(
      `${eventQuery} WHERE e.id = $1 GROUP BY e.id, v.id, a.id`,
      [id],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    // 23503 = foreign key violation: venue, activity type, or tag id doesn't exist
    if (err.code === '23503')
      return res.status(400).json({ error: `Unknown reference: ${err.detail}` })
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

// PATCH /api/events/:id  partial update: send only the fields to change.
// tag_ids (if sent) replaces the event's tags; image_url (if sent) replaces the cover image.
router.patch('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id))
    return res.status(400).json({ error: 'Event id must be an integer' })

  const imageError = validateImageUrl(req.body?.image_url)
  if (imageError) return res.status(400).json({ error: imageError })

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const {
      rows: [existing],
    } = await client.query('SELECT * FROM events WHERE id = $1 FOR UPDATE', [
      id,
    ])
    const denied = ownershipError(existing?.created_by, req.user.id, 'Event')
    if (denied) {
      await client.query('ROLLBACK')
      return res.status(denied.status).json({ error: denied.error })
    }

    // Validate the merged result, so e.g. a new end_time is checked against the stored start_time
    const event = mergeEventPatch(existing, req.body)
    const error = validateEvent(event)
    if (error) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error })
    }

    const resolvedVenueId = await resolveVenueId(
      client,
      event.venue_id,
      event.new_venue,
      req.user.id,
    )
    await client.query(
      `UPDATE events SET venue_id = $2, activity_type_id = $3, title = $4, description = $5,
         what_to_bring = $6, start_time = $7, end_time = $8, price = $9
       WHERE id = $1`,
      [
        id,
        resolvedVenueId,
        event.activity_type_id,
        event.title.trim(),
        event.description ?? null,
        event.what_to_bring ?? null,
        event.start_time,
        event.end_time,
        event.price,
      ],
    )
    if (req.body?.tag_ids !== undefined) {
      await client.query('DELETE FROM event_tags WHERE event_id = $1', [id])
      await client.query(
        'INSERT INTO event_tags (event_id, tag_id) SELECT $1, unnest($2::int[])',
        [id, [...new Set(event.tag_ids)]],
      )
    }
    await saveCoverImage(client, id, req.body?.image_url)

    await client.query('COMMIT')

    const { rows } = await pool.query(
      `${eventQuery} WHERE e.id = $1 GROUP BY e.id, v.id, a.id`,
      [id],
    )
    res.json(rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.code === '23503')
      return res.status(400).json({ error: `Unknown reference: ${err.detail}` })
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

// DELETE /api/events/:id  event_tags and event_images rows go with it (ON DELETE CASCADE)
router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id))
    return res.status(400).json({ error: 'Event id must be an integer' })

  try {
    const { rows } = await pool.query(
      'SELECT created_by FROM events WHERE id = $1',
      [id],
    )
    const denied = ownershipError(rows[0]?.created_by, req.user.id, 'Event')
    if (denied) return res.status(denied.status).json({ error: denied.error })

    // created_by in the WHERE too, so ownership can't change between the check and the delete
    const { rowCount } = await pool.query(
      'DELETE FROM events WHERE id = $1 AND created_by = $2',
      [id, req.user.id],
    )
    if (!rowCount) return res.status(404).json({ error: 'Event not found' })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
