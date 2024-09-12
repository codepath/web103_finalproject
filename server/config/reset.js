import { pool } from "./database.js";
import "./dotenv.js";
import gamesData from "../data/games.js";
import screenShotsData from "../data/screenshots.js";

const createGamesTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS games;

    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      developer VARCHAR(100),
      publisher VARCHAR(100),
      release_date DATE,
      rating VARCHAR(100),
      background_image VARCHAR(500),
      genre INTEGER[],
      price VARCHAR(100),
      platform INTEGER[]
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("🎉 Games table created successfully");
  } catch (err) {
    console.error("⚠️ Error creating games table", err);
  }
};

const createScreenshotsTable = async () => {
  const createTableQuery = `
  DROP TABLE IF EXISTS screenshots;

  CREATE TABLE screenshots (
    screenshot_id SERIAL PRIMARY KEY,
    game_id INT,
    image_url VARCHAR(255)
  );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("🎉 screenshots table created successfully");
  } catch (err) {
    console.error("⚠️ Error creating screenshots table", err);
  }
};

const seedGamesTable = async () => {
  await createGamesTable();

  gamesData.forEach((game) => {
    const insertQuery = {
      text: "INSERT INTO games (name, developer, publisher, release_date, rating, background_image, genre, platform, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      values: [
        game.name,
        game.developer,
        game.publisher,
        game.releaseDate,
        game.rating,
        game.background_image,
        `{${game.genre.join(",")}}`,
        `{${game.platform.join(",")}}`,
        game.price,
      ],
    };

    pool.query(insertQuery.text, insertQuery.values, (err, res) => {
      if (err) {
        console.error("⚠️ Error inserting game", err);
      } else {
        console.log(`✅ ${game.name} added successfully`);
      }
    });
  });
};

const seedScreenshotsTable = async () => {
  await createScreenshotsTable();
  const insertQuery = {
    text: `
      INSERT INTO screenshots (game_id, image_url)
      VALUES ($1, $2, $3)
    `,
    values: [],
  };
  screenShotsData.forEach((screen) => {
    const insertQuery = {
      text: `INSERT INTO screenshots (game_id, image_url)
      VALUES ($1, $2)`,
      values: [screen.game_id, screen.image],
    };

    pool.query(insertQuery.text, insertQuery.values, (err, res) => {
      if (err) {
        console.error("⚠️ Error inserting screen", err);
      } else {
        console.log(`✅ screenshots added successfully`);
      }
    });
  });
};

const createUsersTable = async () => {
  const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      githubid int NOT NULL,
      username varchar(200) NOT NULL,
      avatarurl varchar(500),
      accesstoken varchar(500) NOT NULL
  );
`;
  try {
    const res = await pool.query(createUsersTableQuery);
    console.log("🎉 users table created successfully");
  } catch (err) {
    console.error("⚠️ error creating users table", err);
  }
};

createUsersTable();
seedGamesTable();
seedScreenshotsTable();
