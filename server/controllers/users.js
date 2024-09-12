const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export default {
  getUserById,
};
