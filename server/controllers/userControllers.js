import { pool } from "../config/database.js";

const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query(`
      INSERT INTO Users (name)
      VALUES ($1)
    `, [name]);
    res.status(201);
  } catch (error) {
    res.status(409).json({ error: error.message });
    console.error("Error creating user", error);
  }
};

export default { createUser };