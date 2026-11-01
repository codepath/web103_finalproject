import './dotenv.js'
import pool from '../db.js'
import { readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(new URL('./data/data.json', import.meta.url)))

// Children first so foreign keys never block a drop
const dropAllTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS assignments;
    DROP TABLE IF EXISTS topics;
    DROP TABLE IF EXISTS courses;
    DROP TABLE IF EXISTS users;
  `)
  console.log('all tables dropped successfully')
}

const createUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      first_name text NOT NULL,
      last_name text NOT NULL,
      role text NOT NULL CHECK (role IN ('student', 'ta')),
      created_at timestamp NOT NULL DEFAULT NOW()
    );
  `)
  console.log('users table created successfully')
}

const createCoursesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id serial PRIMARY KEY,
      course_name text NOT NULL,
      ta_id integer NOT NULL REFERENCES users(id),
      created_at timestamp NOT NULL DEFAULT NOW()
    );
  `)
  console.log('courses table created successfully')
}

const createTopicsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS topics (
      id serial PRIMARY KEY,
      course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      name text NOT NULL
    );
  `)
  console.log('topics table created successfully')
}

const createAssignmentsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id serial PRIMARY KEY,
      course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      topic_id integer REFERENCES topics(id) ON DELETE SET NULL,
      created_by integer NOT NULL REFERENCES users(id),
      priority integer,
      title text NOT NULL,
      description text,
      due_date timestamptz NOT NULL,
      created_at timestamp NOT NULL DEFAULT NOW(),
      updated_at timestamp NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS assignments_course_id_idx ON assignments(course_id);
  `)
  console.log('assignments table created successfully')
}

const seedUsersTable = async () => {
  for (const user of data.users) {
    await pool.query(
      'INSERT INTO users (first_name, last_name, role) VALUES ($1, $2, $3)',
      [user.first_name, user.last_name, user.role]
    )
  }
  console.log('users seeded successfully')
}

const seedCoursesTable = async () => {
  for (const course of data.courses) {
    await pool.query(
      'INSERT INTO courses (course_name, ta_id) VALUES ($1, $2)',
      [course.course_name, course.ta_id]
    )
  }
  console.log('courses seeded successfully')
}

const seedTopicsTable = async () => {
  for (const topic of data.topics) {
    await pool.query(
      'INSERT INTO topics (course_id, name) VALUES ($1, $2)',
      [topic.course_id, topic.name]
    )
  }
  console.log('topics seeded successfully')
}

const seedAssignmentsTable = async () => {
  for (const a of data.assignments) {
    await pool.query(
      'INSERT INTO assignments (course_id, topic_id, created_by, priority, title, description, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [a.course_id, a.topic_id, a.created_by, a.priority, a.title, a.description, a.due_date]
    )
  }
  console.log('assignments seeded successfully')
}

const resetDatabase = async () => {
  try {
    await dropAllTables()
    await createUsersTable()
    await createCoursesTable()
    await createTopicsTable()
    await createAssignmentsTable()
    await seedUsersTable()
    await seedCoursesTable()
    await seedTopicsTable()
    await seedAssignmentsTable()
  } catch (err) {
    console.error('error resetting database', err.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

resetDatabase()
