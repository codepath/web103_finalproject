-- Migration 001: add students and RSVPs (GitHub issue #5).
--
-- Additive and safe to re-run. It creates the students and rsvps tables if
-- they are missing and adds the demo student used by the RSVP feature.
-- It does not drop, truncate, or modify the existing categories or events.
--
-- Apply once to an existing database, for example:
--   psql "$DATABASE_URL" -f server/migrations/001_add_students_and_rsvps.sql
--
-- The table definitions match server/schema.sql, which fresh installs use
-- through `npm run db:reset`.

BEGIN;

CREATE TABLE IF NOT EXISTS students (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS rsvps (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id integer NOT NULL REFERENCES students (id) ON DELETE CASCADE,
  event_id integer NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  status text NOT NULL,
  CONSTRAINT rsvps_status_valid CHECK (status IN ('Going', 'Interested')),
  CONSTRAINT rsvps_student_event_unique UNIQUE (student_id, event_id)
);

-- Demo student for RSVP without authentication. The email must match
-- DEMO_STUDENT in server/students.js. Existing rows are left alone.
INSERT INTO students (name, email)
VALUES ('Demo Student', 'demo.student@school.event')
ON CONFLICT (email) DO NOTHING;

COMMIT;
