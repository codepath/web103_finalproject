import { pool } from './database.js';
import { mockData } from '../data/mockData.js';

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

const seedPostTable = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM "POST"');
    const postCount = parseInt(result.rows[0].count);

    if (postCount === 0) {
      for (const post of mockData.posts) {
        const postInsertResult = await pool.query('INSERT INTO "POST" (content, userId) VALUES ($1, $2) RETURNING id', [post.content, post.userId]);
        const postId = postInsertResult.rows[0].id;

        if (post.comments && Array.isArray(post.comments)) {
          for (const comment of post.comments) {
            await pool.query('INSERT INTO "COMMENT" (content, postId) VALUES ($1, $2)', [comment.content, postId]);
            console.log(`✅ Comment on post ${postId} added successfully`);
          }
        }
        console.log(`✅ Post ${postId} added successfully`);
      }
    } else {
      console.log('Posts already exist in the database');
    }
  } catch (err) {
    console.error('⚠️ Error seeding POST table:', err);
    throw err; // Stop the seeding process if there's an error
  }
};


const seedTypeTable = async () => {
  try {
    for (const type of mockData.types) {
      const result = await pool.query('SELECT * FROM "TYPE" WHERE name = $1', [type.name]);
      if (result.rowCount === 0) {
        await pool.query('INSERT INTO "TYPE" (name) VALUES ($1)', [type.name]);
        console.log(`✅ Type ${type.name} added successfully`);
      } else {
        console.log(`Type ${type.name} already exists`);
      }
    }
  } catch (err) {
    console.error('⚠️ Error seeding TYPE table:', err);
  }
};

const seedResourceTable = async () => {
  try {
    for (const resource of mockData.resources) {
      const result = await pool.query('SELECT * FROM "RESOURCE" WHERE link = $1 AND userId = $2', [resource.link, resource.userId]);
      if (result.rowCount === 0) {
        await pool.query('INSERT INTO "RESOURCE" (link, typeId, userId) VALUES ($1, $2, $3)', [resource.link, resource.typeId, resource.userId]);
        console.log(`✅ Resource ${resource.id} added successfully`);
      } else {
        console.log(`Resource ${resource.id} already exists`);
      }
    }
  } catch (err) {
    console.error('⚠️ Error seeding RESOURCE table:', err);
  }
};

const seedAllTables = async () => {
  await createTables();
  // await seedUserTable();
  await seedPostTable();
  await seedTypeTable();
  await seedResourceTable();
};

seedAllTables().then(() => {
  console.log('All tables seeded successfully');
}).catch((error) => {
  console.error('Error seeding tables:', error);
}).finally(() => {
  pool.end();
});
