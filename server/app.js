import express from 'express';
import { deleteEvent, findEvent, insertEvent, listCategories, listEvents, updateEvent } from './events.js';
import { RSVP_STATUSES, findDemoStudent, findRsvp, saveRsvp, studentExists } from './students.js';
import { validateEvent } from './validate.js';

export const app = express();

app.use(express.json());

function parseId(value) {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id > 2147483647) return null;
  return id;
}

function fieldError(res, errors) {
  return res.status(400).json({ error: 'Check the event details and try again.', errors });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/categories', async (req, res) => {
  res.json(await listCategories());
});

app.get('/api/events', async (req, res) => {
  const { categoryId, sort } = req.query;
  if (sort !== undefined && sort !== 'date_asc' && sort !== 'date_desc') {
    return res.status(400).json({ error: 'Sort must be date_asc or date_desc.' });
  }
  let parsedCategoryId = null;
  if (categoryId !== undefined && categoryId !== '') {
    parsedCategoryId = parseId(categoryId);
    if (!parsedCategoryId) return res.status(400).json({ error: 'Category filter must be a category id.' });
  }
  res.json(await listEvents({ categoryId: parsedCategoryId, sort: sort ?? 'date_asc' }));
});

app.get('/api/events/:eventId', async (req, res) => {
  const id = parseId(req.params.eventId);
  const event = id ? await findEvent(id) : null;
  if (!event) return res.status(404).json({ error: 'Event not found.' });
  res.json(event);
});

app.post('/api/events', async (req, res) => {
  const categories = await listCategories();
  const result = validateEvent(req.body, { categoryIds: new Set(categories.map((category) => category.id)) });
  if (!result.ok) return fieldError(res, result.errors);
  res.status(201).json(await insertEvent(result.event));
});

app.patch('/api/events/:eventId', async (req, res) => {
  const id = parseId(req.params.eventId);
  const existing = id ? await findEvent(id) : null;
  if (!existing) return res.status(404).json({ error: 'Event not found.' });
  const body = req.body ?? {};
  if (typeof body !== 'object' || Array.isArray(body)) return fieldError(res, { form: 'Submit the event details as JSON.' });
  const merged = {
    title: body.title !== undefined ? body.title : existing.title,
    description: body.description !== undefined ? body.description : existing.description,
    location: body.location !== undefined ? body.location : existing.location,
    host: body.host !== undefined ? body.host : existing.host,
    categoryId: body.categoryId !== undefined ? body.categoryId : existing.categoryId,
    startsAt: body.startsAt !== undefined ? body.startsAt : existing.startsAt,
    endsAt: body.endsAt !== undefined ? body.endsAt : existing.endsAt,
    imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
  };
  const categories = await listCategories();
  const result = validateEvent(merged, { categoryIds: new Set(categories.map((category) => category.id)) });
  if (!result.ok) return fieldError(res, result.errors);
  const saved = await updateEvent(id, result.event);
  if (!saved) return res.status(404).json({ error: 'Event not found.' });
  res.json(saved);
});

app.delete('/api/events/:eventId', async (req, res) => {
  const id = parseId(req.params.eventId);
  if (!id || !(await deleteEvent(id))) return res.status(404).json({ error: 'Event not found.' });
  res.status(204).end();
});

// RSVP (issue #5). Student ids come from GET /api/students/demo; see server/students.js.
function parseStudentId(value) {
  if (typeof value === 'number') value = String(value);
  return typeof value === 'string' ? parseId(value) : null;
}

app.get('/api/students/demo', async (req, res) => {
  const student = await findDemoStudent();
  if (!student) return res.status(404).json({ error: 'The demo student has not been set up.' });
  res.json(student);
});

app.get('/api/events/:eventId/rsvp', async (req, res) => {
  const eventId = parseId(req.params.eventId);
  if (!eventId) return res.status(404).json({ error: 'Event not found.' });
  const studentId = parseStudentId(req.query.student_id);
  if (!studentId) return res.status(400).json({ error: 'Provide a valid student_id.' });
  if (!(await findEvent(eventId))) return res.status(404).json({ error: 'Event not found.' });
  if (!(await studentExists(studentId))) return res.status(404).json({ error: 'Student not found.' });
  res.json({ rsvp: await findRsvp(eventId, studentId) });
});

app.post('/api/events/:eventId/rsvp', async (req, res) => {
  const eventId = parseId(req.params.eventId);
  if (!eventId) return res.status(404).json({ error: 'Event not found.' });
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Submit the RSVP as JSON.' });
  }
  const studentId = parseStudentId(body.student_id);
  if (!studentId) return res.status(400).json({ error: 'Provide a valid student_id.' });
  if (body.status === undefined || body.status === null || body.status === '') {
    return res.status(400).json({ error: 'Choose Going or Interested.' });
  }
  if (!RSVP_STATUSES.includes(body.status)) {
    return res.status(400).json({ error: 'RSVP status must be Going or Interested.' });
  }
  if (!(await findEvent(eventId))) return res.status(404).json({ error: 'Event not found.' });
  if (!(await studentExists(studentId))) return res.status(404).json({ error: 'Student not found.' });
  try {
    const { rsvp, created } = await saveRsvp(eventId, studentId, body.status);
    res.status(created ? 201 : 200).json({ rsvp });
  } catch (error) {
    // The event or student was deleted between the checks above and the write.
    if (error.code === '23503') return res.status(404).json({ error: 'Event or student not found.' });
    throw error;
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

app.use((error, req, res, next) => {
  if (error instanceof URIError && req.path.startsWith('/api/events/')) {
    return res.status(404).json({ error: 'Event not found.' });
  }
  if (req.path.startsWith('/api')) {
    console.error(error);
    return res.status(500).json({ error: 'The event board is unavailable.' });
  }
  next(error);
});
