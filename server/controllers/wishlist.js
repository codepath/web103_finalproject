import { pool } from '../config/database.js'

const createWishlistMovie = async (req, res) => {
  try {
    const { user_id, movie_id } = req.body

    // Check if the movie is already in the wishlist
    const existingRecord = await pool.query(
      'SELECT * FROM wishlist WHERE user_id = $1 AND movie_id = $2',
      [user_id, movie_id]
    );

    if (existingRecord.rows.length > 0) {
      res.status(409).json({ message: 'Movie is already in the wishlist' });
      return;
    }

    // If not, add the movie to the wishlist
    const results = await pool.query(
      'INSERT INTO wishlist (user_id, movie_id) VALUES ($1, $2) RETURNING *',
      [user_id, movie_id]
    );

    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getWishlistMovies = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT movies.* 
      FROM wishlist 
      INNER JOIN movies ON wishlist.movie_id = movies.movie_id 
      ORDER BY movies.movie_id ASC
    `);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getWishlistMovie = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const results = await pool.query('SELECT * FROM wishlist WHERE movie_id = $1', [id])
    res.status(200).json(results.rows[0])
  }
  catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const deleteWishlistMovie = async (req, res) => {
  try {
    const movie_id = parseInt(req.body.movie_id)
    const user_id = parseInt(req.body.user_id)


    const results = await pool.query('DELETE FROM wishlist WHERE (user_id, movie_id) = ($1, $2)', [user_id, movie_id])
    res.status(200).json(results.rows[0])
  }
  catch (error) {
    res.status(409).json({ error: error.message })
  }
}






export default {
  createWishlistMovie,
  getWishlistMovies,
  getWishlistMovie,
  deleteWishlistMovie
}