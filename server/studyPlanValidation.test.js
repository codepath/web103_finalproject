import test from 'node:test'
import assert from 'node:assert/strict'
import { validateStudyPlan } from './studyPlanValidation.js'

const validStudyPlan = {
  course_id: 1,
  topic_id: 2,
  created_by: 3,
  title: 'Prepare for JavaScript Exam',
  content: 'Review JavaScript concepts and practice coding problems'
}

test('accepts a valid study plan', () => {
  const result = validateStudyPlan(validStudyPlan)

  assert.equal(result.valid, true)
  assert.deepEqual(result.errors, [])
})

test('accepts a study plan without a topic ID', () => {
  const { topic_id, ...studyPlan } = validStudyPlan
  const result = validateStudyPlan(studyPlan)

  assert.equal(result.valid, true)
})

test('rejects a missing or invalid course ID', () => {
  for (const course_id of [undefined, 0, -1, 1.5, '1']) {
    const result = validateStudyPlan({
      ...validStudyPlan,
      course_id
    })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes(
      'Course ID must be a positive integer'
    ))
  }
})

test('rejects an invalid topic ID', () => {
  for (const topic_id of [0, -1, 1.5, '2']) {
    const result = validateStudyPlan({
      ...validStudyPlan,
      topic_id
    })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes(
      'Topic ID must be a positive integer'
    ))
  }
})

test('rejects a missing or invalid creator ID', () => {
  for (const created_by of [undefined, 0, -1, 1.5, '3']) {
    const result = validateStudyPlan({
      ...validStudyPlan,
      created_by
    })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes(
      'Creator ID must be a positive integer'
    ))
  }
})

test('rejects a missing or blank title', () => {
  for (const title of [undefined, null, '', '   ', 123]) {
    const result = validateStudyPlan({
      ...validStudyPlan,
      title
    })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes(
      'Study plan title is required'
    ))
  }
})

test('rejects missing or blank content', () => {
  for (const content of [undefined, null, '', '   ', 123]) {
    const result = validateStudyPlan({
      ...validStudyPlan,
      content
    })

    assert.equal(result.valid, false)
    assert.ok(result.errors.includes(
      'Study plan content is required'
    ))
  }
})

test('reports multiple validation errors', () => {
  const result = validateStudyPlan({
    course_id: 0,
    created_by: -1,
    title: '',
    content: ' '
  })

  assert.equal(result.valid, false)
  assert.equal(result.errors.length, 4)
})

test('rejects missing or null input', () => {
  for (const input of [undefined, null]) {
    const result = validateStudyPlan(input)

    assert.equal(result.valid, false)
    assert.equal(result.errors.length, 4)
  }
})
