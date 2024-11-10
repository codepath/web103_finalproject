import { pool } from './database.js';
import './dotenv.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const currentPath = fileURLToPath(import.meta.url);
const dataFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'));
const data = JSON.parse(dataFile);

// Drop table if it exists and create groups table
const createGroupsTable = async () => {
  const dropQuery = `DROP TABLE IF EXISTS groups CASCADE;`;
  const createQuery = `
    CREATE TABLE groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_by INT REFERENCES users(id) ON DELETE SET NULL
    );
  `;
  try {
    await pool.query(dropQuery);
    await pool.query(createQuery);
    console.log('🎉 groups table created successfully');
  } catch (err) {
    console.error('⚠️ error creating groups table', err);
  }
};

// Drop table if it exists and create sessions table
const createSessionsTable = async () => {
  const dropQuery = `DROP TABLE IF EXISTS sessions CASCADE;`;
  const createQuery = `
    CREATE TABLE sessions (
      id SERIAL PRIMARY KEY,
      group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      finalized_time TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(dropQuery);
    await pool.query(createQuery);
    console.log('🎉 sessions table created successfully');
  } catch (err) {
    console.error('⚠️ error creating sessions table', err);
  }
};

// Drop table if it exists and create users table
const createUsersTable = async () => {
  const dropQuery = `DROP TABLE IF EXISTS users CASCADE;`;
  const createQuery = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      github_id INT NOT NULL,
      username VARCHAR(100) NOT NULL,
      avatar_url TEXT,
      access_token TEXT NOT NULL
    );
  `;
  try {
    await pool.query(dropQuery);
    await pool.query(createQuery);
    console.log('🎉 users table created successfully');
  } catch (err) {
    console.error('⚠️ error creating users table', err);
  }
};

// Drop table if it exists and create sessions_users table for voting on session times
const createSessionsUsersTable = async () => {
  const dropQuery = `DROP TABLE IF EXISTS sessions_users CASCADE;`;
  const createQuery = `
    CREATE TABLE sessions_users (
      session_id INT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      proposed_time TIMESTAMP NOT NULL,
      vote_count INT DEFAULT 0,
      PRIMARY KEY (session_id, user_id)
    );
  `;
  try {
    await pool.query(dropQuery);
    await pool.query(createQuery);
    console.log('🎉 sessions_users table created successfully');
  } catch (err) {
    console.error('⚠️ error creating sessions_users table', err);
  }
};

// Seed users with data
const seedUsersTable = async () => {
    await createUsersTable();
    const user = data.users[0];
    const insertQuery = {
      text: 'INSERT INTO users (github_id, username, avatar_url, access_token) VALUES ($1, $2, $3, $4)',
      values: [user.github_id, user.username, user.avatar_url, user.access_token],
    };
    try {
      await pool.query(insertQuery);
      console.log(`✅ User ${user.username} added successfully`);
    } catch (err) {
      console.error('⚠️ error inserting user', err);
    }
};

// Seed groups with data
const seedGroupsTable = async () => {
  await createGroupsTable();
  data.groups.forEach(group => {
    const insertQuery = {
      text: 'INSERT INTO groups (name, description, created_by) VALUES ($1, $2, $3)',
      values: [group.name, group.description, group.created_by],
    };
    pool.query(insertQuery, (err, res) => {
      if (err) {
        console.error('⚠️ error inserting group', err);
        return;
      }
      console.log(`✅ ${group.name} added successfully`);
    });
  });
};

// Call functions to create tables and seed data
(async () => {
  await createUsersTable();
  await createGroupsTable();
  await createSessionsTable();
  await createSessionsUsersTable();
  await seedUsersTable();
  await seedGroupsTable();
})();
