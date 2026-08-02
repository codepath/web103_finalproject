// Where all the database reset and seeding logic is located. This file is run with the command `npm run reset` in the terminal.

import "./dotenv.js";
import { pool } from "./database.js";
import { users } from "../data/users.js";

// Down/Up comments is convention when it comes to db migrations.
// It tells the order of operations when rolling back (down) or applying (up) migrations.
// In our simple case, the down migration is always run first, so we can safely drop tables before creating them again.
// In bigger migration cases, the order of operations matters more and should be carefully considered/documented! But this is for practice!

// Down: DROP TABLE IF EXISTS users CASCADE;
// Up: CREATE TABLE users (...) below.

// CASCADE also drops trips and destinations (and any future table referencing
// users), since this DROP always runs first and trips.user_id depends on
// users.id, with destinations depending on trips in turn.
const createUsersTableQuery = `
  DROP TABLE IF EXISTS users CASCADE;

  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    display_name VARCHAR NOT NULL,
    home_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

const createUsersTable = async () => {
  try {
    await pool.query(createUsersTableQuery);
    console.log("✅ users table created successfully");
  } catch (error) {
    console.error("⚠️ Error creating users table:", error);
  }
};

const insertUserQuery =
  "INSERT INTO users (display_name, home_currency) VALUES ($1, $2)";

const seedUsers = async () => {
  await createUsersTable();

  for (const user of users) {
    try {
      await pool.query(insertUserQuery, [user.displayName, user.homeCurrency]);
      console.log(`✅ Seeded user: ${user.displayName}`);
    } catch (error) {
      console.error(`⚠️ Error seeding user ${user.displayName}:`, error);
    }
  }
};

// Down: DROP TABLE IF EXISTS trips CASCADE;
// Up: CREATE TABLE trips (...) below.

// New Concept: CASCADE: In our case, it mostly relates to FK. Can think of it as automatic cleanup of child records when a parent record is deleted.
// In this case, if a trip is deleted, all its child records (destinations, packing_list, etc.) should also be deleted. This is done by adding ON DELETE CASCADE to the FK constraint in the child table.

// CASCADE here also drops destinations (and any future table referencing
// trips), so this reset always succeeds regardless of what state the shared
// dev database is in.
// Future child tables (activities, packing_list, etc.) should put
// ON DELETE CASCADE on their own trip_id/destination_id FK instead of here,
// so a trip delete cascades all the way down.
const createTripsTableQuery = `
  DROP TABLE IF EXISTS trips CASCADE;

  CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12, 2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

const createTripsTable = async () => {
  try {
    await pool.query(createTripsTableQuery);
    console.log("✅ trips table created successfully");
  } catch (error) {
    console.error("⚠️ Error creating trips table:", error);
  }
};

// Down: DROP TABLE IF EXISTS destinations CASCADE;
// Up: CREATE TABLE destinations (...) below.

// CASCADE here also drops activities (and any future table referencing
// destinations), same reasoning as trips' own CASCADE drop above: keeps
// reset.js resilient regardless of what state the shared dev database is in.
// Future child tables (activities) should put ON DELETE CASCADE on their own
// destination_id FK instead of here, so a destination delete cascades too.
const createDestinationsTableQuery = `
  DROP TABLE IF EXISTS destinations CASCADE;

  CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    currency_code VARCHAR(3),
    arrival_order INTEGER,
    start_date DATE,
    end_date DATE
  );
`;

const createDestinationsTable = async () => {
  try {
    await pool.query(createDestinationsTableQuery);
    console.log("✅ destinations table created successfully");
  } catch (error) {
    console.error("⚠️ Error creating destinations table:", error);
  }
};

const createExpensesTableQuery = `
  DROP TABLE IF EXISTS expenses;
  CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    amount_usd DECIMAL(12, 2) NOT NULL,
    category VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'actual',
    description TEXT,
    spent_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CHECK (status IN ('estimated', 'actual')),
    CHECK (category IN ('lodging', 'travel', 'activity', 'food'))
  );
`;

const createExpensesTable = async () => {
  try {
    await pool.query (createExpensesTableQuery);
    console.log("✅ expenses table created successfully");
  } catch (error) {
    console.error("⚠️ Error creating expenses table:", error);
  }
};

const createPackingListTableQuery = `
  DROP TABLE IF EXISTS packing_list;
  CREATE TABLE packing_list (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    is_packed BOOLEAN NOT NULL DEFAULT FALSE,
    is_auto_generated BOOLEAN NOT NULL DEFAULT FALSE
  );
`;

const createPackingListTable = async () => {
  try {
    await pool.query(createPackingListTableQuery);
    console.log("✅ packing_list table created successfully");
  } catch (error) {
    console.error("⚠️ Error creating packing_list table:", error);
  }
};

// Down: DROP TABLE IF EXISTS activities;
// Up: CREATE TABLE activities (...) below.
const createActivitiesTableQuery = `
  DROP TABLE IF EXISTS activities;

  CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    scheduled_date DATE,
    start_time TIME,
    duration_minutes INTEGER,
    notes TEXT
  );
`;

const createActivitiesTable = async () => {
  try {
    await pool.query(createActivitiesTableQuery);
    console.log("✅ activities table created successfully");
  } catch (error) {
    console.error("⚠️ Error creating activities table:", error);
  }
};

const seedDBs = async () => {
  try {
    await seedUsers();
    await createTripsTable();
    await createPackingListTable();
    await createExpensesTable();
    await createDestinationsTable();
    await createActivitiesTable();
    console.log("Database seeding complete.");
  } catch (err) {
    console.error("Database seeding failed:", err);
    process.exitCode = 1;
  }
};

seedDBs();
