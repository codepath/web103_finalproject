-- Development reset only. Drop children before parents, without CASCADE so
-- unrelated objects depending on these tables prevent the reset.
DROP TABLE IF EXISTS activity_votes;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS trip_members;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (length(trim(name)) > 0),
  email VARCHAR(255) NOT NULL UNIQUE CHECK (length(trim(email)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trips (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organizer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL CHECK (length(trim(title)) > 0),
  destination VARCHAR(200) NOT NULL CHECK (length(trim(destination)) > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (budget >= 0),
  invite_code VARCHAR(32) NOT NULL UNIQUE CHECK (length(trim(invite_code)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (start_date <= end_date)
);

CREATE TABLE trip_members (
  trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('organizer', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (trip_id, user_id)
);

CREATE TABLE activities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  created_by_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL CHECK (length(trim(title)) > 0),
  location VARCHAR(200),
  scheduled_date DATE,
  description TEXT,
  estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (estimated_cost >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_votes (
  activity_id BIGINT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (activity_id, user_id)
);

CREATE TABLE expenses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  payer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_by_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  description VARCHAR(255) NOT NULL CHECK (length(trim(description)) > 0),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX trips_organizer_id_idx ON trips(organizer_id);
CREATE INDEX trip_members_user_id_idx ON trip_members(user_id);
-- The leading trip_id also supports trip deletion and itinerary queries.
CREATE INDEX activities_trip_date_idx ON activities(trip_id, scheduled_date);
CREATE INDEX activities_created_by_id_idx ON activities(created_by_id);
CREATE INDEX activity_votes_user_id_idx ON activity_votes(user_id);
CREATE INDEX expenses_trip_id_idx ON expenses(trip_id);
CREATE INDEX expenses_payer_id_idx ON expenses(payer_id);
CREATE INDEX expenses_created_by_id_idx ON expenses(created_by_id);
