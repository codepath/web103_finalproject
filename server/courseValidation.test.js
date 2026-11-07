import test from 'node:test'
import assert from 'node:assert/strict'
import { validateCourse } from './courseValidation.js'

test('accepts a valid course', () => {
  const result = validateCourse({
    course_name: 'Web Development',
    ta_id: 1
  })

  assert.deepEqual(result, {
    valid: true,
    errors: []
  })
})

test('rejects a missing course name', () => {
  const result = validateCourse({
    ta_id: 1
  })

  assert.equal(result.valid, false)
  assert.ok(result.errors.includes('Course name is required'))
})

test('rejects an empty course name', () => {
  const result = validateCourse({
    course_name: '   ',
    ta_id: 1
  })

  assert.equal(result.valid, false)
  assert.ok(result.errors.includes('Course name is required'))
})

test('rejects an invalid TA ID', () => {
  const result = validateCourse({
    course_name: 'Web Development',
    ta_id: -1
  })

  assert.equal(result.valid, false)
  assert.ok(result.errors.includes('TA ID must be a positive integer'))
})

test('rejects multiple invalid fields', () => {
  const result = validateCourse({
    course_name: '',
    ta_id: 0
  })

  assert.deepEqual(result, {
    valid: false,
    errors: [
      'Course name is required',
      'TA ID must be a positive integer'
    ]
  })
})
