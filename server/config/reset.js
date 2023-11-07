import { pool } from './database.js'
import './dotenv.js'
import gamesData from '../data/games.js';

const createGamesTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS games;

    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      developer VARCHAR(100),
      publisher VARCHAR(100),
      release_date DATE,
      rating DECIMAL(3,2),
      background_image VARCHAR(500),
      genre INTEGER[],
      platform INTEGER[],
      short_screenshots JSON
    );
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
      text: 'INSERT INTO games (name, developer, publisher, release_date, rating, background_image, genre, platform, short_screenshots) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: [
        game.name, 
        game.developer,
        game.publisher,
        game.releaseDate, 
        game.rating,
        game.background_image,
        `{${game.genre.join(',')}}`,
        `{${game.platform.join(',')}}`,
        JSON.stringify(game.short_screenshots)
      ]
    };

    pool.query(insertQuery.text, insertQuery.values, (err, res) => {
      if (err) {
        console.error('⚠️ Error inserting game', err);
      } else {
        console.log(`✅ ${game.name} added successfully`);
      }
    });
  });
};

seedGamesTable();
