// Run: node --test server/routes/lookups.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { validateVenue } from './lookups.js'

const valid = {
  name: 'Clay & Coffee Studio',
  address: '412 Valencia St',
  city: 'San Francisco',
  latitude: 37.7652,
  longitude: -122.4219,
  website_url: 'https://example.com',
  hours: 'Tue–Sun 10am–8pm',
}

test('a complete venue passes', () => {
  assert.equal(validateVenue(valid), null)
})

test('only name, address and city are required', () => {
  assert.equal(validateVenue({ name: 'A', address: 'B', city: 'C' }), null)
  assert.equal(validateVenue({ ...valid, name: '  ' }), 'name is required')
  assert.equal(validateVenue({ ...valid, city: undefined }), 'city is required')
  assert.equal(validateVenue(null), 'Venue details are required')
})

test('coordinates must come as an in-range pair', () => {
  assert.equal(
    validateVenue({ ...valid, longitude: '' }),
    'Provide both latitude and longitude, or neither',
  )
  assert.equal(
    validateVenue({ ...valid, latitude: 95 }),
    'latitude must be a number between -90 and 90',
  )
  assert.equal(
    validateVenue({ ...valid, longitude: 'east' }),
    'longitude must be a number between -180 and 180',
  )
  assert.equal(
    validateVenue({ ...valid, latitude: '37.7', longitude: '-122.4' }),
    null,
  )
})

test('website must be an http(s) URL', () => {
  assert.equal(
    validateVenue({ ...valid, website_url: 'ftp://x.com' }),
    'website_url must start with https:// or http://',
  )
  assert.equal(
    validateVenue({ ...valid, website_url: 'not a url' }),
    'website_url must be a valid URL',
  )
  assert.equal(validateVenue({ ...valid, website_url: '' }), null)
})

test('overlong fields are rejected', () => {
  assert.equal(
    validateVenue({ ...valid, name: 'x'.repeat(121) }),
    'name must be 120 characters or fewer',
  )
})
