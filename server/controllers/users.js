import { pool } from "../config/database.js";

const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error " });
  }
};

export default { getUserById };
