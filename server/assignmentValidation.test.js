import test from 'node:test'
import assert from 'node:assert/strict'
import { validateAssignment } from './assignmentValidation.js'

const futureDate = () => new Date(Date.now() + 86400000).toISOString()

const validAssignment = () => ({
  course_id: 1,
  topic_id: 2,
  created_by: 3,
  priority: 1,
  title: 'Build a REST API',
  description: 'Implement GET and POST routes',
  due_date: futureDate()
})

test('accepts a valid assignment', () => {
  assert.deepEqual(validateAssignment(validAssignment()), {
    valid: true,
    errors: []
  })
})

test('accepts an assignment without optional fields', () => {
  const { topic_id, priority, description, ...assignment } = validAssignment()

  assert.equal(validateAssignment(assignment).valid, true)
})

test('accepts null optional fields', () => {
  const result = validateAssignment({
    ...validAssignment(),
    topic_id: null,
    priority: null,
    description: null
  })

  assert.equal(result.valid, true)
})

test('rejects a missing or invalid course ID', () => {
  for (const course_id of [undefined, 0, -1, 1.5, '1']) {
    const result = validateAssignment({ ...validAssignment(), course_id })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes('Course ID must be a positive integer'))
  }
})

test('rejects an invalid topic ID', () => {
  for (const topic_id of [0, -1, 1.5, '2']) {
    const result = validateAssignment({ ...validAssignment(), topic_id })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes('Topic ID must be a positive integer'))
  }
})

test('rejects a missing or invalid creator ID', () => {
  for (const created_by of [undefined, 0, -1, 1.5, '3']) {
    const result = validateAssignment({ ...validAssignment(), created_by })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes('Creator ID must be a positive integer'))
  }
})

test('rejects an invalid priority', () => {
  for (const priority of [0, -1, 1.5, '1']) {
    const result = validateAssignment({ ...validAssignment(), priority })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes('Priority must be a positive integer'))
  }
})

test('rejects a missing or blank title', () => {
  for (const title of [undefined, null, '', '   ', 123]) {
    const result = validateAssignment({ ...validAssignment(), title })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes('Assignment title is required'))
  }
})

test('rejects a non-string description', () => {
  const result = validateAssignment({ ...validAssignment(), description: 5 })

  assert.equal(result.valid, false)
  assert.ok(result.errors.includes('Assignment description must be a string'))
})

test('rejects a missing or unparseable due date', () => {
  for (const due_date of [undefined, null, '', 'not a date', 12345]) {
    const result = validateAssignment({ ...validAssignment(), due_date })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes('Due date must be a valid date'))
  }
})

test('accepts a due date in the past', () => {
  const result = validateAssignment({
    ...validAssignment(),
    due_date: '2020-01-01T00:00:00Z'
  })

  assert.deepEqual(result, { valid: true, errors: [] })
})

test('reports every invalid required field', () => {
  assert.deepEqual(
    validateAssignment({
      course_id: 0,
      created_by: -1,
      title: '',
      due_date: 'nope'
    }),
    {
      valid: false,
      errors: [
        'Course ID must be a positive integer',
        'Creator ID must be a positive integer',
        'Assignment title is required',
        'Due date must be a valid date'
      ]
    }
  )
})

test('rejects missing or null input', () => {
  for (const input of [undefined, null]) {
    const result = validateAssignment(input)

    assert.equal(result.valid, false)
    assert.equal(result.errors.length, 4)
  }
})
