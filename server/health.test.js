import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import app from './app.js'
import pool from './db.js'

// pool.query is replaced with a fake in each test, so no database is needed
test('GET /api/health', async (t) => {
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => server.close())

  const HEALTH_URL = `http://127.0.0.1:${server.address().port}/api/health`

  await t.test('returns 200 when the database responds', async (t) => {
    t.mock.method(pool, 'query', async () => ({ rows: [] }))

    const response = await fetch(HEALTH_URL)

    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'ok', db: 'ok' })
  })

  await t.test('returns 503 when the database is unreachable', async (t) => {
    t.mock.method(pool, 'query', async () => {
      throw new Error('connection refused')
    })
    // Silences the expected "Health check failed" log
    // We only need this for the Render db anyway
    t.mock.method(console, 'error', () => {})

    const response = await fetch(HEALTH_URL)

    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), { status: 'error', db: 'unreachable' })
  })
})
