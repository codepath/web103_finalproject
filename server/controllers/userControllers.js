import { pool } from "../config/database.js";

const createUserAndReadingList = async (req, res) => {
  try {
    const { name } = req.body;

    const results = await pool.query(`
      INSERT INTO Users (name)
      VALUES ($1)
      RETURNING id
    `, [name]);

    const userId = results.rows[0].id;

    await pool.query(`
      INSERT INTO ReadingLists (user_id)
      VALUES ($1)
    `, [userId]);

    res.send(201);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default { createUserAndReadingList };