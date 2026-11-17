CREATE TABLE categories (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL UNIQUE
);

CREATE TABLE events (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id integer NOT NULL REFERENCES categories (id),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  host text NOT NULL,
  image_url text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  CONSTRAINT events_end_after_start CHECK (ends_at > starts_at)
);

CREATE TABLE students (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE
);

CREATE TABLE rsvps (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id integer NOT NULL REFERENCES students (id) ON DELETE CASCADE,
  event_id integer NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  status text NOT NULL,
  CONSTRAINT rsvps_status_valid CHECK (status IN ('Going', 'Interested')),
  CONSTRAINT rsvps_student_event_unique UNIQUE (student_id, event_id)
);
