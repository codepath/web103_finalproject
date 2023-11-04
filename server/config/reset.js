import { pool } from './database.js'
import './dotenv.js'
import gamesData from '../data/games.js';

const createGamesTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS games;

    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      developer VARCHAR(255) NOT NULL,
      publisher VARCHAR(255) NOT NULL,
      release_date DATE NOT NULL,
      genre VARCHAR(50) NOT NULL,
      platform VARCHAR(50) NOT NULL,
      price NUMERIC(6,2) NOT NULL
    )
  `;

  try {
    await pool.query(createTableQuery);
    console.log('🎉 Games table created successfully');
  } catch (err) {
    console.error('⚠️ Error creating games table', err);
  }
};

const seedGamesTable = async () => {
  await createGamesTable();

  gamesData.forEach((game) => {
    const insertQuery = {
      text: 'INSERT INTO games (title, developer, publisher, release_date, genre, platform, price) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [
        game.title,
        game.developer,
        game.publisher,
        new Date(game.releaseDate),
        game.genre,
        game.platform,
        game.price
      ]
    };

    pool.query(insertQuery.text, insertQuery.values, (err, res) => {
      if (err) {
        console.error('⚠️ Error inserting game', err);
      } else {
        console.log(`✅ ${game.title} added successfully`);
      }
    });
  });
};

seedGamesTable();
