import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url);
const dataFile = fs.readFileSync(path.join(dirname(currentPath), '../data/starterData.json'));
const data = JSON.parse(dataFile);

const createUsersTable = async () => {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password_hash VARCHAR(200) NOT NULL, // It's good practice to store hashed passwords
        email VARCHAR(150),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(createUsersTableQuery);
      console.log('🎉 Users table created successfully');
    } catch (err) {
      console.error('⚠️ Error creating users table', err);
    }
  };

  
  const createPostsTable = async () => {
    const createPostsTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(createPostsTableQuery);
      console.log('🎉 Posts table created successfully');
    } catch (err) {
      console.error('⚠️ Error creating posts table', err);
    }
  };

  
  const createCommentsTable = async () => {
    const createCommentsTableQuery = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INT REFERENCES posts(id),
        user_id INT REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(createCommentsTableQuery);
      console.log('🎉 Comments table created successfully');
    } catch (err) {
      console.error('⚠️ Error creating comments table', err);
    }
  };

  
  const createReactionsTable = async () => {
    const createReactionsTableQuery = `
      CREATE TABLE IF NOT EXISTS reactions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        post_id INT REFERENCES posts(id),
        comment_id INT REFERENCES comments(id),
        reaction_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(createReactionsTableQuery);
      console.log('🎉 Reactions table created successfully');
    } catch (err) {
      console.error('⚠️ Error creating reactions table', err);
    }
  };

  
  const createResourcesTable = async () => {
    const createResourcesTableQuery = `
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        title VARCHAR(200) NOT NULL,
        url TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(createResourcesTableQuery);
      console.log('🎉 Resources table created successfully');
    } catch (err) {
      console.error('⚠️ Error creating resources table', err);
    }
  };

  
  const createEventsTable = async () => {
    const createEventsTableQuery = `
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE NOT NULL,
        location VARCHAR(200),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        organizer_id INT REFERENCES users(id)
      );
    `;
  
    try {
      await pool.query(createEventsTableQuery);
      console.log('🎉 Events table created successfully');
    } catch (err) {
      console.error('⚠️ Error creating events table', err);
    }
  };

  

  const createUserNetworkTable = async () => {
    const createUserNetworkTableQuery = `
      CREATE TABLE IF NOT EXISTS user_network (
        user_id INT REFERENCES users(id),
        mentor_id INT REFERENCES users(id),
        mentee_id INT REFERENCES users(id),
        PRIMARY KEY (user_id, mentor_id, mentee_id)
      );
    `;
  
    try {
      await pool.query(createUserNetworkTableQuery);
      console.log('🎉 User_Network table created successfully');
    } catch (err) {
      console.error('⚠️ Error creating user_network table', err);
    }
  };

  
  const createUserPreferencesTable = async () => {
    const createUserPreferencesTableQuery = `
      CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INT PRIMARY KEY REFERENCES users(id),
        learning_preferences TEXT,
        interests TEXT
      );
    `;
  
    try {
      await pool.query(createUserPreferencesTableQuery);
      console.log('🎉 User_Preferences table created successfully');
    } catch (err) {
      console.error('⚠️ Error creating user_preferences table', err);
    }
  };

  
  const resetDatabase = async () => {
    await createUsersTable();
    await createPostsTable();
    await createCommentsTable();
    await createReactionsTable();
    await createResourcesTable();
    await createEventsTable();
    await createUserNetworkTable();
    await createUserPreferencesTable();
  };
  
  resetDatabase().then(() => {
    console.log('🚀 Database reset complete!');
  }).catch(err => {
    console.error('⚠️ Error resetting database', err);
  });


  const seedUsersTable = async () => {
    data.users.forEach(async (user) => {
      const insertQuery = {
        text: 'INSERT INTO users (username, password_hash, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
        values: [
          user.username,
          user.password_hash, // Make sure you're storing hashed passwords. You may need to hash them before if they are not.
          user.email,
          user.created_at, // Ensure these dates are in a valid format
          user.updated_at,
        ],
      };
  
      try {
        await pool.query(insertQuery);
        console.log(`✅ User ${user.username} added successfully.`);
      } catch (err) {
        console.error('⚠️ Error inserting user:', err.stack);
      }
    });
  };
  
  // Add the remaining seed[Table] functions here, following the same structure as seedUsersTable.
  
  const setupDatabase = async () => {
    // Create tables
    await createUsersTable();
    await createPostsTable();
    await createCommentsTable();
    await createReactionsTable();
    await createResourcesTable();
    await createEventsTable();
    await createUserNetworkTable();
    await createUserPreferencesTable();
  
    // Seed tables
    await seedUsersTable();
    // ... call other table seeding functions
  };
  
  setupDatabase().then(() => {
    console.log('🚀 Database setup complete!');
  }).catch(err => {
    console.error('⚠️ Error setting up database:', err.stack);
  });