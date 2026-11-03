import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import app from './app.js'
import pool from './db.js'

const futureDate = () => new Date(Date.now() + 86400000).toISOString()

// Seeded by `npm run reset`: course 1 (Web Development) has topic 1, course 2 has topic 4
const validBody = () => ({
  course_id: 1,
  topic_id: 1,
  created_by: 1,
  priority: 1,
  title: 'Test Assignment',
  description: 'Created by the test suite',
  due_date: futureDate()
})

const post = (baseUrl, body) =>
  fetch(`${baseUrl}/api/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

test('POST /api/assignments', async (t) => {
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => server.close())

  const BASE_URL = `http://127.0.0.1:${server.address().port}`

  await t.test('returns 400 with validation errors for an invalid body', async () => {
    const response = await post(BASE_URL, { course_id: 0, title: '' })

    assert.equal(response.status, 400)
    assert.ok((await response.json()).errors.length > 0)
  })

  await t.test('returns 400 when the body is empty', async () => {
    const response = await fetch(`${BASE_URL}/api/assignments`, { method: 'POST' })

    assert.equal(response.status, 400)
  })

  // The remaining cases need the seeded database (CI runs `npm run reset` first)
  const hasDb = Boolean(process.env.DATABASE_URL || process.env.PGHOST)
  const dbOptions = { skip: hasDb ? false : 'no database configured' }

  await t.test('creates an assignment and returns it', dbOptions, async () => {
    const response = await post(BASE_URL, validBody())
    const created = await response.json()

    try {
      assert.equal(response.status, 201)
      assert.equal(created.title, 'Test Assignment')
      assert.equal(created.course_id, 1)
      assert.ok(created.id)
    } finally {
      if (created.id) {
        await pool.query('DELETE FROM assignments WHERE id = $1', [created.id])
      }
    }
  })

  await t.test('accepts a due date in the past', dbOptions, async () => {
    const response = await post(BASE_URL, { ...validBody(), due_date: '2020-01-01T00:00:00Z' })
    const created = await response.json()

    try {
      assert.equal(response.status, 201)
    } finally {
      if (created.id) {
        await pool.query('DELETE FROM assignments WHERE id = $1', [created.id])
      }
    }
  })

  await t.test('returns 400 when the topic belongs to another course', dbOptions, async () => {
    const response = await post(BASE_URL, { ...validBody(), topic_id: 4 })

    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), {
      errors: ['Topic does not belong to the course']
    })
  })

  await t.test('returns 400 when the course does not exist', dbOptions, async () => {
    const response = await post(BASE_URL, { ...validBody(), course_id: 9999, topic_id: null })

    assert.equal(response.status, 400)
  })

  t.after(() => pool.end())
})
