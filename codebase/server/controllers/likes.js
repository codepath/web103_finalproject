import pool from '../config/database.js'

const getLikedItemsByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const likedItems = await pool.query(
      'SELECT i.* FROM items i INNER JOIN users_saved_items usi ON i.id = usi.item_id WHERE usi.user_id = $1',
      [user_id]
    );

    res.status(200).json(likedItems.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLike = async (req, res) => {
  try {
    const { user_id, item_id } = req.params;

    await pool.query(
      'DELETE FROM users_saved_items WHERE user_id = $1 AND item_id = $2',
      [user_id, item_id]
    );

    res.status(200).json({ message: 'Like deleted successfully' });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
}

const addLike = async (req, res) => {
  try {
    const { user_id, item_id } = req.params;

    await pool.query(
      'INSERT INTO users_saved_items (user_id, item_id) VALUES ($1, $2)',
      [user_id, item_id]
    );

    res.status(200).json({ message: 'Like added successfully' });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
}

export default {getLikedItemsByUser, deleteLike, addLike};