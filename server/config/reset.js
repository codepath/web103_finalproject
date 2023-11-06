import { pool } from './database.js';
//import { mockData } from '../data/mockData.js';

const createUserTable = `
CREATE TABLE IF NOT EXISTS "USER" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
`;

const createPostTable = `
CREATE TABLE IF NOT EXISTS "POST" (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  userId INTEGER REFERENCES "USER"(id)
  title VARCHAR(255),
);
`;

// Comment out or remove the following functions to prevent seeding mock data

// const seedUserTable = async () => {
//   try {
//     for (const user of mockData.users) {
//       await pool.query('INSERT INTO "USER" (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING', [user.username, user.password]);
//       console.log(`✅ User ${user.username} added successfully`);
//     }
//   } catch (err) {
//     console.error('⚠️ Error seeding USER table:', err);
//   }
// };

// const seedPostTable = async () => {
//   try {
//     const result = await pool.query('SELECT COUNT(*) FROM "POST"');
//     const postCount = parseInt(result.rows[0].count);

//     if (postCount === 0) {
//       for (const post of mockData.posts) {
//         const postInsertResult = await pool.query('INSERT INTO "POST" (content, userId) VALUES ($1, $2) RETURNING id', [post.content, post.userId]);
//         const postId = postInsertResult.rows[0].id;

//         if (post.comments && Array.isArray(post.comments)) {
//           for (const comment of post.comments) {
//             await pool.query('INSERT INTO "COMMENT" (content, postId) VALUES ($1, $2)', [comment.content, postId]);
//             console.log(`✅ Comment on post ${postId} added successfully`);
//           }
//         }
//         console.log(`✅ Post ${postId} added successfully`);
//       }
//     } else {
//       console.log('Posts already exist in the database');
//     }
//   } catch (err) {
//     console.error('⚠️ Error seeding POST table:', err);
//     throw err;
//   }
// };

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
  userId INTEGER REFERENCES "USER"(id)
);
`;

const createTables = async () => {
  try {
    await pool.query(createUserTable);
    console.log('🎉 USER table created successfully');
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

// const seedAllTables = async () => {
//   await createTables();
//   await seedUserTable();
//   await seedPostTable();
//   // Add similar calls for other seeding functions here
// };

// Comment out or remove this block to prevent seeding mock data

// seedAllTables().then(() => {
//   console.log('All tables seeded successfully');
// }).catch((error) => {
//   console.error('Error seeding tables:', error);
// }).finally(() => {
//   pool.end();
// });
