import {pool} from '../config/database.js';

const getAllGames = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM games');
    res.status(200).json(results.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json(results.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const createGame = async (req, res) => {
  try {
    const { title, developer, publisher, release_date, genre, platform, price } = req.body;
    const results = await pool.query('INSERT INTO games (title, developer, publisher, release_date, genre, platform, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [title, developer, publisher, release_date, genre, platform, price]);
    res.status(201).json(results.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, developer, publisher, release_date, genre, platform, price } = req.body;
    const results = await pool.query('UPDATE games SET title = $1, developer = $2, publisher = $3, release_date = $4, genre = $5, platform = $6, price = $7 WHERE id = $8 RETURNING *', [title, developer, publisher, release_date, genre, platform, price, id]);
    res.status(200).json(results.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM games WHERE id = $1', [id]);
    res.status(200).json({ message: "Game deleted" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export default {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
}
