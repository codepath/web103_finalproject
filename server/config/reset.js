import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const dataFile = fileURLToPath(new URL('./data.json', import.meta.url))
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))

const schema = `
  DROP TABLE IF EXISTS event_images, event_tags, events, tags, activity_types, venues, profiles, users CASCADE;

  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    github_id TEXT UNIQUE, -- NULL for seed users, who can't log in
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );

  -- One-to-one with users: UNIQUE user_id means each user has at most one profile
  CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    city TEXT,
    website_url TEXT
  );

  CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    website_url TEXT,
    hours TEXT
  );

  CREATE TABLE activity_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    activity_type_id INTEGER NOT NULL REFERENCES activity_types(id),
    title TEXT NOT NULL,
    description TEXT,
    what_to_bring TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE event_tags (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_id)
  );

  CREATE TABLE event_images (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
  );
`

function validateData() {
  const expected = {
    users: 3,
    venues: 4,
    activity_types: 5,
    tags: 10,
    events: 8,
  }

  for (const [name, count] of Object.entries(expected)) {
    if (!Array.isArray(data[name]) || data[name].length !== count) {
      throw new Error(`Invalid ${name}: expected ${count} records`)
    }
  }

  function idsFor(name) {
    const ids = data[name].map((row) => row.id)

    if (
      ids.some((id) => !Number.isSafeInteger(id) || id <= 0) ||
      new Set(ids).size !== ids.length
    ) {
      throw new Error(`Invalid or duplicate IDs in ${name}`)
    }

    return new Set(ids)
  }

  const users = idsFor('users')
  const venues = idsFor('venues')
  const types = idsFor('activity_types')
  const tags = idsFor('tags')
  idsFor('events')

  const requiredText = (value, label) => {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`Invalid text: ${label}`)
    }
  }

  for (const user of data.users) {
    requiredText(user.name, 'user.name')
    requiredText(user.email, 'user.email')
  }

  for (const venue of data.venues) {
    if (!users.has(venue.owner_id)) {
      throw new Error(`Invalid owner for venue ${venue.id}`)
    }

    requiredText(venue.name, 'venue.name')
    requiredText(venue.address, 'venue.address')
    requiredText(venue.city, 'venue.city')

    if (
      venue.latitude != null &&
      (!Number.isFinite(Number(venue.latitude)) ||
        Math.abs(Number(venue.latitude)) > 90)
    ) {
      throw new Error(`Invalid latitude for venue ${venue.id}`)
    }

    if (
      venue.longitude != null &&
      (!Number.isFinite(Number(venue.longitude)) ||
        Math.abs(Number(venue.longitude)) > 180)
    ) {
      throw new Error(`Invalid longitude for venue ${venue.id}`)
    }
  }

  for (const row of [...data.activity_types, ...data.tags]) {
    requiredText(row.name, 'type/tag name')
  }

  let tagLinks = 0
  let imageCount = 0

  for (const event of data.events) {
    if (!venues.has(event.venue_id)) {
      throw new Error(`Invalid venue for event ${event.id}`)
    }

    if (!types.has(event.activity_type_id)) {
      throw new Error(`Invalid activity type for event ${event.id}`)
    }

    requiredText(event.title, 'event.title')
    requiredText(event.start_time, 'event.start_time')
    requiredText(event.end_time, 'event.end_time')

    if (!Number.isFinite(Number(event.price)) || Number(event.price) < 0) {
      throw new Error(`Invalid price for event ${event.id}`)
    }

    if (!Array.isArray(event.tag_ids) || !Array.isArray(event.images)) {
      throw new Error(`Invalid relationships for event ${event.id}`)
    }

    if (new Set(event.tag_ids).size !== event.tag_ids.length) {
      throw new Error(`Duplicate tags for event ${event.id}`)
    }

    for (const tagId of event.tag_ids) {
      if (!tags.has(tagId)) {
        throw new Error(`Unknown tag ${tagId}`)
      }
    }

    for (const image of event.images) {
      requiredText(image.url, 'image.url')

      if (!Number.isSafeInteger(image.position) || image.position < 0) {
        throw new Error(`Invalid image position for event ${event.id}`)
      }
    }

    tagLinks += event.tag_ids.length
    imageCount += event.images.length
  }

  if (tagLinks !== 20 || imageCount !== 8) {
    throw new Error('Unexpected event relationship counts')
  }

  console.log('Seed JSON validation passed.')
  console.table({
    users: data.users.length,
    venues: data.venues.length,
    activity_types: data.activity_types.length,
    tags: data.tags.length,
    events: data.events.length,
    event_tags: tagLinks,
    event_images: imageCount,
  })
}

async function insertRow(client, table, columns, values) {
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
  await client.query(sql, values)
}

async function seedDatabase(client) {
  for (const user of data.users) {
    await insertRow(
      client,
      'users',
      ['id', 'name', 'email'],
      [user.id, user.name, user.email],
    )
    if (user.profile) {
      await insertRow(
        client,
        'profiles',
        ['user_id', 'bio', 'city', 'website_url'],
        [
          user.id,
          user.profile.bio,
          user.profile.city,
          user.profile.website_url,
        ],
      )
    }
  }

  for (const venue of data.venues) {
    await insertRow(
      client,
      'venues',
      [
        'id',
        'owner_id',
        'name',
        'address',
        'city',
        'latitude',
        'longitude',
        'website_url',
        'hours',
      ],
      [
        venue.id,
        venue.owner_id,
        venue.name,
        venue.address,
        venue.city,
        venue.latitude,
        venue.longitude,
        venue.website_url,
        venue.hours,
      ],
    )
  }

  for (const type of data.activity_types) {
    await insertRow(
      client,
      'activity_types',
      ['id', 'name'],
      [type.id, type.name],
    )
  }

  for (const tag of data.tags) {
    await insertRow(client, 'tags', ['id', 'name'], [tag.id, tag.name])
  }

  for (const event of data.events) {
    // Seeded events belong to their venue's owner
    const createdBy = data.venues.find((v) => v.id === event.venue_id).owner_id
    await insertRow(
      client,
      'events',
      [
        'id',
        'venue_id',
        'activity_type_id',
        'title',
        'description',
        'what_to_bring',
        'start_time',
        'end_time',
        'price',
        'created_by',
      ],
      [
        event.id,
        event.venue_id,
        event.activity_type_id,
        event.title,
        event.description,
        event.what_to_bring,
        event.start_time,
        event.end_time,
        event.price,
        createdBy,
      ],
    )

    for (const tagId of event.tag_ids) {
      await insertRow(
        client,
        'event_tags',
        ['event_id', 'tag_id'],
        [event.id, tagId],
      )
    }

    for (const image of event.images) {
      await insertRow(
        client,
        'event_images',
        ['event_id', 'url', 'position'],
        [event.id, image.url, image.position],
      )
    }
  }

  // Explicit IDs require synchronizing PostgreSQL SERIAL sequences.
  for (const table of ['users', 'venues', 'activity_types', 'tags', 'events']) {
    await client.query(
      `
      SELECT setval(
        pg_get_serial_sequence($1, 'id'),
        (SELECT MAX(id) FROM ${table}),
        true
      )
    `,
      [table],
    )
  }
}

async function main() {
  validateData()

  if (!process.argv.includes('--execute-reset')) {
    console.log('Validation only. PostgreSQL was not accessed.')
    console.log('No tables were dropped or modified.')
    return
  }

  if (process.env.LOCALBLOOM_CONFIRM_RESET !== 'DELETE_AND_RESEED_LOCALBLOOM') {
    throw new Error('Explicit reset confirmation is required.')
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Reset is blocked in production mode.')
  }

  const { pool } = await import('./database.js')
  const client = await pool.connect()
  let transactionStarted = false

  try {
    const identity = await client.query(`
      SELECT current_database() AS database,
             current_user AS username,
             inet_server_addr() AS server_address
    `)

    console.table(identity.rows)

    await client.query('BEGIN')
    transactionStarted = true

    await client.query(schema)
    await seedDatabase(client)

    await client.query('COMMIT')
    transactionStarted = false

    console.log('Database reset and seeded successfully.')
  } catch (error) {
    if (transactionStarted) {
      await client.query('ROLLBACK')
    }
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Used by POST /api/reset. Unlike the CLI reset it keeps the schema, GitHub users and
// sessions (so the person clicking stays logged in) and only puts the demo data back.
export async function resetDemoData(pool) {
  validateData()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(`
      TRUNCATE event_images, event_tags, events, tags, activity_types, venues RESTART IDENTITY;
      DELETE FROM users WHERE github_id IS NULL;
    `)
    await seedDatabase(client)
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Only run the CLI when this file is executed (npm run reset), not when the server imports it
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error('Reset/validation failed:', error.message)
    process.exitCode = 1
  })
}
