// Run: node --test server/middleware/auth.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { requireAuth, ownershipError } from './auth.js'

function fakeRes() {
  return {
    code: null,
    body: null,
    status(c) {
      this.code = c
      return this
    },
    json(b) {
      this.body = b
      return this
    },
  }
}

test('requireAuth blocks anonymous requests with 401', () => {
  const res = fakeRes()
  let called = false
  requireAuth({}, res, () => {
    called = true
  })
  assert.equal(res.code, 401)
  assert.equal(called, false)
})

test('requireAuth lets logged-in users through', () => {
  let called = false
  requireAuth({ user: { id: 1 } }, fakeRes(), () => {
    called = true
  })
  assert.equal(called, true)
})

test('ownershipError: 404 missing, 403 not creator, null for creator', () => {
  assert.equal(ownershipError(undefined, 1, 'Event').status, 404)
  assert.equal(ownershipError(2, 1, 'Event').status, 403)
  assert.equal(ownershipError(1, 1, 'Event'), null)
})
