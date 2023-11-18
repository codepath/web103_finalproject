import pool from '../config/database.js'

const getLikedItemsByUser = async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);

    const likedItems = await pool.query(
      'SELECT i.* FROM items i INNER JOIN users_saved_items usi ON i.id = usi.item_id WHERE usi.user_id = $1',
      [user_id]
    );

    res.status(200).json(likedItems.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {getLikedItemsByUser};