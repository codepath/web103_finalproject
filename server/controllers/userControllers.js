import { pool } from "../config/database.js";

const createUser = async (req, res) => {
  try {
    const { name } = req.body;

    await pool.query(`
      INSERT INTO Users (name)
      VALUES ($1)
    `, [name]);

    res.send(201);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default { createUser };