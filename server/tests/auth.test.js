import test from 'node:test';
import assert from 'node:assert/strict';
import { safeReturnTo } from '../config/auth.js';
import { requireAuth, requireTrustedOrigin } from '../middleware/auth.js';

test('login return destinations stay within trip pages', () => {
  for (const path of ['/trips', '/trips/2/expenses?day=1', '/trips/new']) {
    assert.equal(safeReturnTo(path), path);
  }
  for (const path of ['https://example.com', '//example.com', '/trips\\evil', '/tripscam', undefined]) {
    assert.equal(safeReturnTo(path), '/trips');
  }
});
test('protected controllers receive only an authenticated session user ID', () => {
  let status, body, called = false;
  const res = { status(value) { status = value; return this; }, json(value) { body = value; } };
  requireAuth({ isAuthenticated: () => false, headers: { 'x-user-id': '1' } }, res, () => { called = true; });
  assert.equal(status, 401);
  assert.ok(body.error);
  assert.equal(called, false);
  const req = { isAuthenticated: () => true, user: { id: 42 } };
  requireAuth(req, res, () => { called = true; });
  assert.equal(req.userId, 42);
  assert.equal(called, true);
});
test('cross-origin writes are rejected while OAuth GET callbacks are allowed', () => {
  let status, called = false;
  const res = { status(value) { status = value; return this; }, json() {} };
  requireTrustedOrigin({ method: 'POST', get: () => 'https://example.com' }, res, () => { called = true; });
  assert.equal(status, 403);
  assert.equal(called, false);
  requireTrustedOrigin({ method: 'GET' }, res, () => { called = true; });
  assert.equal(called, true);
});
