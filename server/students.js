import { getPool } from './db.js';

// Demo identity for RSVP. School.Event has no sign-in, so every visitor acts
// as this one seeded student. This is not authentication. The student is
// looked up by its unique email, so the app never assumes a particular id.
// Keep this email in sync with server/migrations/001_add_students_and_rsvps.sql.
export const DEMO_STUDENT = { name: 'Demo Student', email: 'demo.student@school.event' };

export const RSVP_STATUSES = ['Going', 'Interested'];

function toRsvp(row) {
  return { id: row.id, studentId: row.student_id, eventId: row.event_id, status: row.status };
}

export async function findDemoStudent() {
  const { rows } = await getPool().query('SELECT id, name, email FROM students WHERE email = $1', [DEMO_STUDENT.email]);
  return rows[0] ?? null;
}

export async function studentExists(id) {
  const { rowCount } = await getPool().query('SELECT 1 FROM students WHERE id = $1', [id]);
  return rowCount > 0;
}

export async function findRsvp(eventId, studentId) {
  const { rows } = await getPool().query(
    'SELECT id, student_id, event_id, status FROM rsvps WHERE event_id = $1 AND student_id = $2',
    [eventId, studentId],
  );
  return rows[0] ? toRsvp(rows[0]) : null;
}

// Insert the student's RSVP, or change the status of the one they already have.
// The UNIQUE (student_id, event_id) constraint keeps it to one row per pair.
// xmax = 0 only for a freshly inserted row, which tells callers whether it was created.
export async function saveRsvp(eventId, studentId, status) {
  const { rows } = await getPool().query(
    `INSERT INTO rsvps (student_id, event_id, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (student_id, event_id) DO UPDATE SET status = EXCLUDED.status
     RETURNING id, student_id, event_id, status, (xmax = 0) AS created`,
    [studentId, eventId, status],
  );
  return { rsvp: toRsvp(rows[0]), created: rows[0].created };
}
