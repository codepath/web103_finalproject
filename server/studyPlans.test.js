import test, { mock } from 'node:test'
import assert from 'node:assert/strict'
import pool from './db.js'
import app from './app.js'

// Helper function to send POST requests to the API
async function postStudyPlan(body) {
  const server = app.listen(0)

  try {
    const port = server.address().port

    const response = await fetch(
      `http://127.0.0.1:${port}/api/study-plans`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    return {
      status: response.status,
      data: await response.json()
    }
  } finally {
    await new Promise((resolve, reject) => {
      server.close(err => err ? reject(err) : resolve())
    })
  }
}

// Example valid study plan
const validPlan = {
  course_id: 1,
  topic_id: 2,
  created_by: 1,
  title: 'Study for Biology Exam',
  content: 'Review chapters 1 through 5.'
}

// Test 1: Reject invalid input before calling the database
test('POST /api/study-plans rejects invalid data', async () => {
  const queryMock = mock.method(pool, 'query', async () => {
    throw new Error('Database should not be called')
  })

  try {
    const response = await postStudyPlan({
      course_id: -1,
      created_by: 1,
      title: '',
      content: ''
    })

    assert.equal(response.status, 400)
    assert.ok(Array.isArray(response.data.errors))
    assert.ok(response.data.errors.length > 0)
    assert.equal(queryMock.mock.callCount(), 0)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 2: Create a valid study plan
test('POST /api/study-plans creates a valid study plan', async () => {
  const createdPlan = {
    id: 1,
    ...validPlan,
    created_at: '2026-11-01T12:00:00.000Z',
    updated_at: '2026-11-01T12:00:00.000Z'
  }

  const queryMock = mock.method(pool, 'query', async (sql) => {
    // First query: verify topic belongs to the course
    if (sql.includes('SELECT id FROM topics')) {
      return { rows: [{ id: 2 }] }
    }

    // Second query: insert and return the new study plan
    return { rows: [createdPlan] }
  })

  try {
    const response = await postStudyPlan(validPlan)

    assert.equal(response.status, 201)
    assert.deepEqual(response.data, createdPlan)
    assert.equal(queryMock.mock.callCount(), 2)

    const [lookupSql, lookupValues] =
      queryMock.mock.calls[0].arguments

    assert.match(lookupSql, /SELECT id FROM topics/)
    assert.deepEqual(lookupValues, [2, 1])

    const [insertSql, insertValues] =
      queryMock.mock.calls[1].arguments

    assert.match(insertSql, /INSERT INTO study_plans/)
    assert.deepEqual(insertValues, [
      1,
      2,
      1,
      'Study for Biology Exam',
      'Review chapters 1 through 5.'
    ])
  } finally {
    queryMock.mock.restore()
  }
})

// Test 3: Reject invalid foreign-key references
test('POST /api/study-plans handles invalid foreign keys', async () => {
  const queryMock = mock.method(pool, 'query', async () => {
    const error = new Error('Foreign key violation')
    error.code = '23503'
    throw error
  })

  try {
    // Omit the topic to test the INSERT foreign-key error directly.
    const response = await postStudyPlan({
      ...validPlan,
      topic_id: null
    })

    assert.equal(response.status, 400)
    assert.match(response.data.error, /does not exist/)
    assert.equal(queryMock.mock.callCount(), 1)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 4: Reject topics that do not belong to the selected course
test('POST /api/study-plans rejects a topic from another course', async () => {
  const queryMock = mock.method(pool, 'query', async () => ({
    rows: []
  }))

  try {
    const response = await postStudyPlan(validPlan)

    assert.equal(response.status, 400)
    assert.equal(
      response.data.error,
      'Topic does not belong to the selected course'
    )

    // Only the topic lookup should run; no INSERT should occur.
    assert.equal(queryMock.mock.callCount(), 1)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 5: Return HTTP 500 for unexpected database failures
test('POST /api/study-plans handles unexpected database errors', async () => {
  const queryMock = mock.method(pool, 'query', async () => {
    throw new Error('Database unavailable')
  })

  // Silence the expected error log during this test.
  const consoleMock = mock.method(console, 'error', () => {})

  try {
    const response = await postStudyPlan({
      ...validPlan,
      topic_id: null
    })

    assert.equal(response.status, 500)
    assert.equal(
      response.data.error,
      'Failed to create study plan'
    )
    assert.equal(queryMock.mock.callCount(), 1)
  } finally {
    consoleMock.mock.restore()
    queryMock.mock.restore()
  }
})
