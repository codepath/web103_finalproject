import test, { mock } from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import pool from './db.js'
import app from './app.js'

// Send requests to a temporary local Express server.
// Wait until the server is listening before making requests.
async function requestCourse(path, options = {}) {
  const server = app.listen(0, '127.0.0.1')

  try {
    if (!server.listening) {
      await once(server, 'listening')
    }

    const port = server.address().port

    const response = await fetch(
      `http://127.0.0.1:${port}${path}`,
      options
    )

    return {
      status: response.status,
      data: await response.json()
    }
  } finally {
    if (server.listening) {
      await new Promise((resolve, reject) => {
        server.close(err => err ? reject(err) : resolve())
      })
    }
  }
}

// Helper for creating courses.
function postCourse(body) {
  return requestCourse('/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

// Sample data used in mocked database responses.
const sampleCourse = {
  id: 1,
  course_name: 'Web Development',
  ta_id: 1,
  created_at: '2026-11-01T12:00:00.000Z'
}

const sampleAssignment = {
  id: 1,
  course_id: 1,
  topic_id: 1,
  created_by: 1,
  priority: 2,
  title: 'Build a REST API',
  description: 'Implement API routes.',
  due_date: '2026-12-01T23:59:00.000Z',
  created_at: '2026-11-01T12:00:00.000Z',
  updated_at: '2026-11-01T12:00:00.000Z'
}

// Test 1: Retrieve all courses.
test('GET /api/courses returns all courses', async () => {
  const queryMock = mock.method(pool, 'query', async () => ({
    rows: [sampleCourse]
  }))

  try {
    const response = await requestCourse('/api/courses')

    assert.equal(response.status, 200)
    assert.deepEqual(response.data, [sampleCourse])
    assert.equal(queryMock.mock.callCount(), 1)

    const [sql] = queryMock.mock.calls[0].arguments
    assert.match(sql, /FROM courses/)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 2: Retrieve one course by ID.
test('GET /api/courses/:id returns a course', async () => {
  const queryMock = mock.method(pool, 'query', async () => ({
    rows: [sampleCourse]
  }))

  try {
    const response = await requestCourse('/api/courses/1')

    assert.equal(response.status, 200)
    assert.deepEqual(response.data, sampleCourse)
    assert.equal(queryMock.mock.callCount(), 1)

    const [sql, values] = queryMock.mock.calls[0].arguments

    assert.match(sql, /FROM courses/)
    assert.deepEqual(values, [1])
  } finally {
    queryMock.mock.restore()
  }
})

// Test 3: Return 404 when a course does not exist.
test('GET /api/courses/:id returns 404 when missing', async () => {
  const queryMock = mock.method(pool, 'query', async () => ({
    rows: []
  }))

  try {
    const response = await requestCourse('/api/courses/999')

    assert.equal(response.status, 404)
    assert.deepEqual(response.data, {
      error: 'Course not found'
    })
    assert.equal(queryMock.mock.callCount(), 1)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 4: Reject invalid course IDs.
test('GET /api/courses/:id rejects invalid IDs', async () => {
  const queryMock = mock.method(pool, 'query', async () => {
    throw new Error('Database should not be called')
  })

  try {
    const response = await requestCourse('/api/courses/abc')

    assert.equal(response.status, 400)
    assert.equal(response.data.error, 'Invalid course ID')
    assert.equal(queryMock.mock.callCount(), 0)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 5: Create a valid course.
test('POST /api/courses creates a course', async () => {
  const queryMock = mock.method(pool, 'query', async () => ({
    rows: [sampleCourse]
  }))

  try {
    const response = await postCourse({
      course_name: ' Web Development ',
      ta_id: 1
    })

    assert.equal(response.status, 201)
    assert.deepEqual(response.data, sampleCourse)
    assert.equal(queryMock.mock.callCount(), 1)

    const [sql, values] = queryMock.mock.calls[0].arguments

    assert.match(sql, /INSERT INTO courses/)
    assert.deepEqual(values, [
      'Web Development',
      1
    ])
  } finally {
    queryMock.mock.restore()
  }
})

// Test 6: Reject invalid course creation input.
test('POST /api/courses rejects invalid input', async () => {
  const queryMock = mock.method(pool, 'query', async () => {
    throw new Error('Database should not be called')
  })

  try {
    const response = await postCourse({
      course_name: '',
      ta_id: -1
    })

    assert.equal(response.status, 400)
    assert.ok(Array.isArray(response.data.errors))
    assert.ok(response.data.errors.length > 0)
    assert.equal(queryMock.mock.callCount(), 0)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 7: Handle invalid TA foreign-key references.
test('POST /api/courses handles invalid TA references', async () => {
  const queryMock = mock.method(pool, 'query', async () => {
    const error = new Error('Foreign key violation')
    error.code = '23503'
    throw error
  })

  try {
    const response = await postCourse({
      course_name: 'Web Development',
      ta_id: 999
    })

    assert.equal(response.status, 400)
    assert.equal(
      response.data.error,
      'Referenced TA does not exist'
    )
    assert.equal(queryMock.mock.callCount(), 1)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 8: Retrieve assignments belonging to a course.
test('GET /api/courses/:id/assignments returns assignments', async () => {
  const queryMock = mock.method(pool, 'query', async (sql) => {
    if (sql.includes('FROM courses')) {
      return {
        rows: [{ id: 1 }]
      }
    }

    if (sql.includes('FROM assignments')) {
      return {
        rows: [sampleAssignment]
      }
    }

    throw new Error('Unexpected SQL query')
  })

  try {
    const response = await requestCourse(
      '/api/courses/1/assignments'
    )

    assert.equal(response.status, 200)
    assert.deepEqual(response.data, [sampleAssignment])
    assert.equal(queryMock.mock.callCount(), 2)

    const [courseSql, courseValues] =
      queryMock.mock.calls[0].arguments

    assert.match(courseSql, /FROM courses/)
    assert.deepEqual(courseValues, [1])

    const [assignmentSql, assignmentValues] =
      queryMock.mock.calls[1].arguments

    assert.match(assignmentSql, /FROM assignments/)
    assert.deepEqual(assignmentValues, [1])
  } finally {
    queryMock.mock.restore()
  }
})

// Test 9: Return 404 for assignments of a missing course.
test('GET /api/courses/:id/assignments returns 404 for missing course', async () => {
  const queryMock = mock.method(pool, 'query', async () => ({
    rows: []
  }))

  try {
    const response = await requestCourse(
      '/api/courses/999/assignments'
    )

    assert.equal(response.status, 404)
    assert.equal(response.data.error, 'Course not found')
    assert.equal(queryMock.mock.callCount(), 1)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 10: Reject invalid IDs when retrieving assignments.
test('GET /api/courses/:id/assignments rejects invalid IDs', async () => {
  const queryMock = mock.method(pool, 'query', async () => {
    throw new Error('Database should not be called')
  })

  try {
    const response = await requestCourse(
      '/api/courses/invalid/assignments'
    )

    assert.equal(response.status, 400)
    assert.equal(response.data.error, 'Invalid course ID')
    assert.equal(queryMock.mock.callCount(), 0)
  } finally {
    queryMock.mock.restore()
  }
})

// Test 11: Handle unexpected database failures.
test('GET /api/courses handles unexpected database errors', async () => {
  const queryMock = mock.method(pool, 'query', async () => {
    throw new Error('Database unavailable')
  })

  // Suppress the expected error log during this test.
  const consoleMock = mock.method(console, 'error', () => {})

  try {
    const response = await requestCourse('/api/courses')

    assert.equal(response.status, 500)
    assert.equal(
      response.data.error,
      'Failed to fetch courses'
    )
    assert.equal(queryMock.mock.callCount(), 1)
  } finally {
    consoleMock.mock.restore()
    queryMock.mock.restore()
  }
})
