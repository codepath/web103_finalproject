import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, before, describe, test } from 'node:test';
import { app } from './app.js';
import { closePool } from './db.js';
import { resetDatabase } from './reset.js';

describe('School.Event API', { concurrency: false }, () => {
  let server;
  let baseUrl;

  before(async () => {
    await resetDatabase();
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await closePool();
  });

  async function request(path, options) {
    const response = await fetch(`${baseUrl}${path}`, options);
    const body = response.status === 204 ? null : await response.json();
    return { status: response.status, body, response };
  }

  function post(body) {
    return request('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  function hoursFromNow(hours) {
    return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  }

  async function categoryId(slug) {
    const { body } = await request('/api/categories');
    return body.find((category) => category.slug === slug).id;
  }

  function eventInput(overrides = {}) {
    return {
      title: 'Night Market',
      description: 'Food, music, and student clubs on the quad.',
      location: 'Main Quad',
      host: 'Student Activities Board',
      startsAt: hoursFromNow(48),
      endsAt: hoursFromNow(50),
      imageUrl: '',
      ...overrides,
    };
  }

  test('health reports that the API is available', async () => {
    const { status, body } = await request('/api/health');
    assert.equal(status, 200);
    assert.deepEqual(body, { status: 'ok' });
  });

  test('events lists all six samples with the frontend contract', async () => {
    await resetDatabase();
    const { status, body: events } = await request('/api/events');
    assert.equal(status, 200);
    assert.deepEqual(events.map(({ title, category, imageUrl }) => [title, category, imageUrl]), [
      ['Club Expo', 'clubs', '/images/club-expo.jpg'],
      ['Guest Lecture: AI & Society', 'academic', '/images/lecture.jpg'],
      ['Fall Career Fair', 'career', '/images/career-fair.jpg'],
      ['Intramural Soccer Finals', 'sports', '/images/soccer.jpg'],
      ['Midnight Pancake Study Break', 'social', '/images/pancakes.jpg'],
      ['Open Mic Night', 'arts', '/images/open-mic.jpg'],
    ]);
    assert.equal(new Set(events.map(({ id }) => id)).size, 6);
    for (const event of events) {
      assert.equal(Number.isInteger(event.id), true);
      assert.equal(Number.isInteger(event.categoryId), true);
      for (const field of ['title', 'description', 'category', 'startsAt', 'endsAt', 'location', 'host', 'imageUrl']) {
        assert.equal(typeof event[field], 'string');
        assert.ok(event[field].length > 0);
      }
      assert.equal(new Date(event.startsAt).toISOString(), event.startsAt.replace('Z', '.000Z'));
      assert.equal(new Date(event.endsAt).toISOString(), event.endsAt.replace('Z', '.000Z'));
      assert.ok(Date.parse(event.endsAt) > Date.parse(event.startsAt));
      assert.ok(Date.parse(event.startsAt) > Date.now());
    }
  });

  test('each detail matches its listed event', async () => {
    const { body: events } = await request('/api/events');
    for (const event of events) {
      const { status, body } = await request(`/api/events/${event.id}`);
      assert.equal(status, 200);
      assert.deepEqual(body, event);
    }
  });

  test('unknown and malformed IDs return the event JSON 404', async () => {
    for (const id of ['999', '0', '-1', 'abc', '1abc', '1.0', '01', '1e0', '9007199254740993', '%ZZ', '%E0%A4%A']) {
      const { status, body } = await request(`/api/events/${id}`);
      assert.equal(status, 404, id);
      assert.deepEqual(body, { error: 'Event not found.' });
    }
  });

  test('unknown API routes return JSON 404', async () => {
    for (const [path, method] of [['/api', 'GET'], ['/api/missing', 'GET'], ['/api/events/1/extra', 'GET'], ['/api/events/1', 'POST']]) {
      const { status, body, response } = await request(path, { method });
      assert.equal(status, 404);
      assert.match(response.headers.get('content-type'), /application\/json/);
      assert.deepEqual(body, { error: 'API route not found.' });
    }
  });

  test('categories supply filter and form options', async () => {
    const { status, body } = await request('/api/categories');
    assert.equal(status, 200);
    assert.deepEqual(body.map(({ slug, name }) => [slug, name]), [
      ['clubs', 'Clubs'],
      ['academic', 'Academic'],
      ['career', 'Career'],
      ['sports', 'Sports'],
      ['social', 'Social'],
      ['arts', 'Arts'],
    ]);
  });

  test('category filter and date sort narrow the current list', async () => {
    const career = await categoryId('career');
    const filtered = await request(`/api/events?categoryId=${career}&sort=date_asc`);
    assert.deepEqual(filtered.body.map((event) => event.title), ['Fall Career Fair']);
    const descending = await request('/api/events?sort=date_desc');
    const times = descending.body.map((event) => Date.parse(event.startsAt));
    assert.deepEqual(times, [...times].sort((a, b) => b - a));
    assert.equal(descending.body[0].title, 'Open Mic Night');
    const badSort = await request('/api/events?sort=title');
    assert.equal(badSort.status, 400);
    assert.equal(badSort.body.error, 'Sort must be date_asc or date_desc.');
    const badCategory = await request('/api/events?categoryId=abc');
    assert.equal(badCategory.status, 400);
  });

  test('rejected creates leave the stored events unchanged', async () => {
    const before = await request('/api/events');
    const rejected = await post(eventInput({
      title: '   ',
      categoryId: 999999,
      startsAt: hoursFromNow(-3),
      endsAt: hoursFromNow(-4),
    }));
    assert.equal(rejected.status, 400);
    assert.equal(rejected.body.errors.title, 'Enter a title.');
    assert.equal(rejected.body.errors.categoryId, 'Choose a category from the list.');
    assert.equal(rejected.body.errors.startsAt, 'Start time must be in the future.');
    assert.equal(rejected.body.errors.endsAt, 'End time must be after the start time.');
    const after = await request('/api/events');
    assert.deepEqual(after.body, before.body);
  });

  test('create persists an event that a later request can read', async () => {
    const created = await post(eventInput({ categoryId: await categoryId('social') }));
    assert.equal(created.status, 201);
    assert.equal(created.body.title, 'Night Market');
    assert.equal(created.body.category, 'social');
    assert.equal(created.body.imageUrl, null);
    await closePool();
    const again = await request(`/api/events/${created.body.id}`);
    assert.equal(again.status, 200);
    assert.deepEqual(again.body, created.body);
    await resetDatabase();
  });

  test('partial edits save valid results and reject inconsistent ones', async () => {
    const { body: [event] } = await request('/api/events');
    const saved = await request(`/api/events/${event.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: 'Library Lawn' }),
    });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.location, 'Library Lawn');
    assert.equal(saved.body.title, event.title);
    assert.equal(saved.body.startsAt, event.startsAt);
    const rejected = await request(`/api/events/${event.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endsAt: new Date(Date.parse(event.startsAt) - 60 * 60 * 1000).toISOString() }),
    });
    assert.equal(rejected.status, 400);
    assert.equal(rejected.body.errors.endsAt, 'End time must be after the start time.');
    const unchanged = await request(`/api/events/${event.id}`);
    assert.equal(unchanged.body.location, 'Library Lawn');
    assert.equal(unchanged.body.endsAt, event.endsAt);
    const missing = await request('/api/events/999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: 'Nowhere' }),
    });
    assert.equal(missing.status, 404);
    await resetDatabase();
  });

  function rsvp(eventId, body) {
    return request(`/api/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  test('the seeded demo student identifies RSVPs', async () => {
    const { status, body } = await request('/api/students/demo');
    assert.equal(status, 200);
    assert.equal(Number.isInteger(body.id), true);
    assert.equal(body.email, 'demo.student@school.event');
  });

  test('RSVP saves, updates in place, and survives a later read', async () => {
    const { body: student } = await request('/api/students/demo');
    const { body: [event] } = await request('/api/events');
    const empty = await request(`/api/events/${event.id}/rsvp?student_id=${student.id}`);
    assert.equal(empty.status, 200);
    assert.deepEqual(empty.body, { rsvp: null });

    const created = await rsvp(event.id, { student_id: student.id, status: 'Going' });
    assert.equal(created.status, 201);
    assert.deepEqual(created.body.rsvp, { id: created.body.rsvp.id, studentId: student.id, eventId: event.id, status: 'Going' });

    const changed = await rsvp(event.id, { student_id: student.id, status: 'Interested' });
    assert.equal(changed.status, 200);
    assert.equal(changed.body.rsvp.id, created.body.rsvp.id);
    assert.equal(changed.body.rsvp.status, 'Interested');

    await closePool();
    const read = await request(`/api/events/${event.id}/rsvp?student_id=${student.id}`);
    assert.deepEqual(read.body.rsvp, changed.body.rsvp);
    await resetDatabase();
  });

  test('RSVP rejects bad input and missing records without saving', async () => {
    const { body: student } = await request('/api/students/demo');
    const { body: [event] } = await request('/api/events');
    const cases = [
      [event.id, { student_id: student.id }, 400, 'Choose Going or Interested.'],
      [event.id, { student_id: student.id, status: 'going' }, 400, 'RSVP status must be Going or Interested.'],
      [event.id, { student_id: 'abc', status: 'Going' }, 400, 'Provide a valid student_id.'],
      [event.id, { status: 'Going' }, 400, 'Provide a valid student_id.'],
      [event.id, { student_id: 999999, status: 'Going' }, 404, 'Student not found.'],
      [999999, { student_id: student.id, status: 'Going' }, 404, 'Event not found.'],
      ['abc', { student_id: student.id, status: 'Going' }, 404, 'Event not found.'],
    ];
    for (const [eventId, body, status, error] of cases) {
      const result = await rsvp(eventId, body);
      assert.equal(result.status, status, JSON.stringify(body));
      assert.deepEqual(result.body, { error });
    }
    const badQuery = await request(`/api/events/${event.id}/rsvp?student_id=abc`);
    assert.equal(badQuery.status, 400);
    const stored = await request(`/api/events/${event.id}/rsvp?student_id=${student.id}`);
    assert.deepEqual(stored.body, { rsvp: null });
  });

  test('deleting an event removes its RSVPs', async () => {
    const { body: student } = await request('/api/students/demo');
    const { body: [event] } = await request('/api/events');
    await rsvp(event.id, { student_id: student.id, status: 'Going' });
    const removed = await request(`/api/events/${event.id}`, { method: 'DELETE' });
    assert.equal(removed.status, 204);
    const gone = await request(`/api/events/${event.id}/rsvp?student_id=${student.id}`);
    assert.equal(gone.status, 404);
    await resetDatabase();
  });

  test('delete removes a persisted event and missing events stay 404', async () => {
    const { body: events } = await request('/api/events');
    const removed = await request(`/api/events/${events[0].id}`, { method: 'DELETE' });
    assert.equal(removed.status, 204);
    assert.equal(removed.body, null);
    const missing = await request(`/api/events/${events[0].id}`);
    assert.equal(missing.status, 404);
    assert.deepEqual(missing.body, { error: 'Event not found.' });
    const again = await request(`/api/events/${events[0].id}`, { method: 'DELETE' });
    assert.equal(again.status, 404);
    const remaining = await request('/api/events');
    assert.equal(remaining.body.some((event) => event.id === events[0].id), false);
    await resetDatabase();
  });
});
