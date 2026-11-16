// Run: node --test server/routes/events.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeEventPatch, validateEvent } from './events.js'

// Shaped like a row from `SELECT * FROM events` (pg returns NUMERIC as a string, TIMESTAMP as a Date)
const existing = {
  id: 1,
  venue_id: 1,
  activity_type_id: 1,
  title: 'Intro to Wheel Throwing',
  description: null,
  what_to_bring: null,
  start_time: new Date('2026-12-01T18:00'),
  end_time: new Date('2026-12-01T20:00'),
  price: '45.00',
  created_by: 1,
}

test('PATCH with only a title keeps every other field and passes validation', () => {
  const merged = mergeEventPatch(existing, { title: 'Wheel Throwing 101' })
  assert.equal(merged.title, 'Wheel Throwing 101')
  assert.equal(merged.price, 45)
  assert.equal(merged.venue_id, 1)
  assert.equal(validateEvent(merged), null)
})

test('PATCH end_time before the stored start_time is rejected', () => {
  const merged = mergeEventPatch(existing, { end_time: '2026-12-01T17:00' })
  assert.equal(validateEvent(merged), 'end_time must be after start_time')
})

test('PATCH with a bad field is rejected', () => {
  assert.equal(
    validateEvent(mergeEventPatch(existing, { price: -5 })),
    'price must be a number >= 0',
  )
  assert.equal(
    validateEvent(mergeEventPatch(existing, { title: '  ' })),
    'title is required',
  )
})
