import { pool } from "../configs/db.config.js";
import tutorsData from "./data/tutors.json" assert { type: "json" };
import subjectsData from "./data/subjects.json" assert { type: "json" };
import schoolsData from "./data/schools.json" assert { type: "json" };
import availabilitiesData from "./data/availabilities.json" assert { type: "json" };

const dropAllTables = async () => {
  const dropTableQuery = `
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || r.tablename || ' CASCADE';
        END LOOP;
      END $$;
  `;

  try {
    const res = await pool.query(dropTableQuery);
    console.log("🎉 tables dropped successfully");
  } catch (err) {
    console.error("⚠️ error dropping tables", err);
  }
};

const createUsersTable = async () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        github_id INT NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        profile_picture VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        bio VARCHAR(255),
        school_id INT references schools(id),
        subject_id INT references subjects(id),
        year INT
      );\
  `;

  try {
    const res = await pool.query(createTableQuery);
    console.log("🎉 users table created successfully");
  } catch (err) {
    console.error("⚠️ error creating users table", err);
  }
};

const createSubjectsTable = async () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );\
  `;
  try {
    const res = await pool.query(createTableQuery);
    console.log("🎉 subjects table created successfully");
  } catch (err) {
    console.error("⚠️ error creating subjects table", err);
  }
};

const createSchoolsTable = async () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );\
  `;
  try {
    const res = await pool.query(createTableQuery);
    console.log("🎉 schools table created successfully");
  } catch (err) {
    console.error("⚠️ error creating schools table", err);
  }
};

const createAvailabilitiesTable = async () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS availabilities (
        id SERIAL PRIMARY KEY,
        tutor_id INT NOT NULL references users(id),
        time_block INT NOT NULL,
        CONSTRAINT unique_tutor_time UNIQUE (tutor_id, time_block)
      );\
  `;
  try {
    const res = await pool.query(createTableQuery);
    console.log("🎉 availabilities table created successfully");
  } catch (err) {
    console.error("⚠️ error creating availabilities table", err);
  }
};

const createSessionsTable = async () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        student_id INT NOT NULL references users(id),
        tutor_id INT NOT NULL references users(id),
        subject_id INT NOT NULL references subjects(id),
        availability_id INT NOT NULL references availabilities(id),
        rating NUMERIC(2,1),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL
      );\
  `;

  try {
    const res = await pool.query(createTableQuery);
    console.log("🎉 sessions table created successfully");
  } catch (err) {
    console.error("⚠️ error creating sessions table", err);
  }
};

const seedUsersTable = async () => {
  console.log("🌱 seeding users table");
  tutorsData.forEach((user) => {
    const insertQuery = {
      text: "INSERT INTO users (email, github_id, username, profile_picture, role, bio, school_id, subject_id, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    };

    const values = [
      user.email,
      user.githubId,
      user.username,
      user.profilePicture,
      user.role,
      user.bio,
      user.schoolId,
      user.subjectId,
      user.year,
    ];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ error inserting user", err);
        return;
      }
      console.log(`✅ ${user.username} added successfully`);
    });
  });
};

const seedSubjectsTable = async () => {
  console.log("🌱 seeding subjects table");
  subjectsData.forEach((subject) => {
    const insertQuery = {
      text: "INSERT INTO subjects (name) VALUES ($1)",
    };

    const values = [subject.name];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ error inserting subject", err);
        return;
      }
      console.log(`✅ ${subject.name} added successfully`);
    });
  });
};

const seedSchoolsTable = async () => {
  console.log("🌱 seeding schools table");
  schoolsData.forEach((school) => {
    const insertQuery = {
      text: "INSERT INTO schools (name) VALUES ($1)",
    };

    const values = [school.name];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ error inserting school", err);
        return;
      }
      console.log(`✅ ${school.name} added successfully`);
    });
  });
};

const seedAvailabilitiesTable = async () => {
  console.log("🌱 seeding availabilities table");
  availabilitiesData.forEach((availability) => {
    const insertQuery = {
      text: "INSERT INTO availabilities (tutor_id, time_block) VALUES ($1, $2)",
    };

    const values = [availability.tutorId, availability.timeBlock];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ error inserting availability", err);
        return;
      }
      console.log(
        `✅ Availability for tutor ${availability.tutorId} added successfully`
      );
    });
  });
};

/**
 * In development, set up the database by dropping, recreating, and seeding the tables. In production, only create the tables if they don't already exist.
 */
const setup = async () => {
  if (process.env.NODE_ENV === "development") {
    await dropAllTables();
  }
  await createSubjectsTable();
  await createSchoolsTable();
  await seedSubjectsTable();
  await seedSchoolsTable();
  await createUsersTable();
  await createAvailabilitiesTable();
  await createSessionsTable();
  // if (process.env.NODE_ENV === "development") {
  await seedUsersTable();
  await seedAvailabilitiesTable();
  // }
};

export default setup;
