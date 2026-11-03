import { pool } from "./database.js";

const createStatusEnum = async () => {
  try {
    await pool.query(`
      CREATE TYPE ReadingStatus AS ENUM ('UNREAD', 'READING', 'FINISHED')
    `);
  } catch (error) {
    console.error("Error creating ReadingStatus type", error);
  }
};

//add columns for OAuth
const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL
      )
    `);
  } catch (error) {
    console.error("Error creating Users table", error);
  }
};

const createReadingListsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ReadingLists (
        id SERIAL PRIMARY KEY,
        user_id INT references Users(id)
      )
    `);
  } catch (error) {
    console.error("Error creating ReadingLists table", error);
  }
};

const createBooksTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Books (
        id SERIAL PRIMARY KEY,
        list_id INT references ReadingLists(id),
        title VARCHAR(255),
        author VARCHAR(255),
        genre VARCHAR(255),
        year INT,
        page_count INT,
        current_page INT DEFAULT 0,
        cover_image VARCHAR(255),
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        last_updated TIMESTAMPTZ DEFAULT NOW(),
        status ReadingStatus DEFAULT 'UNREAD'
      )
    `);
  } catch (error) {
    console.error("Error creating Books table", error);
  }
};

const createAchievementsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Achievements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        requirement TEXT
      )
    `)
  } catch (error) {
    console.error("Error creating Achievements table", error);
  }
};

const createUserAchievementsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS UserAchievements (
        id SERIAL PRIMARY KEY,
        acheivement_id INT REFERENCES Achievements(id),
        user_id INT REFERENCES Users(id)
      )
    `);
  } catch (error) {
    console.error("Error creating UserAchievements table", error);
  }
};

//insert achievements from data/achievements.js
const seedAchievementsTable = async () => {

};

const reset = async () => {
  try {
    await pool.query("DROP TABLE IF EXISTS Users, ReadingLists, Books, Achievements, UserAchievements CASCADE;");
    await pool.query("DROP TYPE IF EXISTS ReadingStatus;");

    await createStatusEnum();
    await createUsersTable();
    await createReadingListsTable();
    await createBooksTable();
    await createAchievementsTable();
    await createUserAchievementsTable();
  } catch (error) {
    console.error("Error running reset function", error);
  }
};

reset();