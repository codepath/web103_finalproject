import { pool } from './database.js';

const createUserTable = `
CREATE TABLE IF NOT EXISTS "GITHUBUSER" (
  id SERIAL PRIMARY KEY,
  username text UNIQUE NOT NULL,
  avatarurl text,
  githubid text UNIQUE,
  accesstoken text
);
`;

const createPostTable = `
CREATE TABLE IF NOT EXISTS "POST" (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  userId INTEGER REFERENCES "GITHUBUSER"(id)
);
`;



const createCommentTable = `
CREATE TABLE IF NOT EXISTS "COMMENT" (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  postId INTEGER REFERENCES "POST"(id)
);
`;

const createTypeTable = `
CREATE TABLE IF NOT EXISTS "TYPE" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
`;

const createResourceTable = `
CREATE TABLE IF NOT EXISTS "RESOURCE" (
  id SERIAL PRIMARY KEY,
  link VARCHAR(255) NOT NULL,
  typeId INTEGER REFERENCES "TYPE"(id),
  userId INTEGER REFERENCES "GITHUBUSER"(id)
);
`;

const createTables = async () => {
  try {
    await pool.query(createUserTable);
    console.log('🎉 GITHUBUSER table created successfully');
    await pool.query(createPostTable);
    console.log('🎉 POST table created successfully');
    await pool.query(createCommentTable);
    console.log('🎉 COMMENT table created successfully');
    await pool.query(createTypeTable);
    console.log('🎉 TYPE table created successfully');
    await pool.query(createResourceTable);
    console.log('🎉 RESOURCE table created successfully');
  } catch (err) {
    console.error('⚠️ Error creating tables:', err);
  }
};

// Comment out or remove the calls to seeding functions to prevent seeding mock data



// Comment out or remove this block to prevent seeding mock data


