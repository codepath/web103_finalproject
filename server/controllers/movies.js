import { pool } from '../config/database.js'

const createMovie = async (req, res) => {
  const { title, description, tag, actors, director, publish_date, img_url, trailer_url } = req.body
  try {
    // Insert into movies table
    const movieResults = await pool.query(
      `INSERT INTO movies (title, description, tag, actors, director, publish_date, img_url, trailer_url)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [title, description, tag, actors, director, publish_date, img_url, trailer_url]
    )

    // Get movie_id and tag_id
    const result_movieID = await pool.query(
      `SELECT movie_id FROM movies
      WHERE title = $1`,
      [title]
    )
    const result_tagID = await pool.query(
      `SELECT tag_id FROM tags
      WHERE genre = $1`,
      [tag]
    )
    
    const movie_id = result_movieID.rows[0].movie_id
    const tag_id = result_tagID.rows[0].tag_id
    // Insert into movies_tags table
    const tagResults = await pool.query(
      `INSERT INTO movies_tags (movie_id, tag_id)
      VALUES($1, $2) 
      RETURNING *`,
      [movie_id, tag_id]
    )

    res.status(201).json({ movie: movieResults.rows[0], tag: tagResults.rows[0] })
  } catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const getMovies = async (req, res) => {
    try {
      const results = await pool.query('SELECT * FROM movies ORDER BY movie_id ASC')
      res.status(200).json(results.rows)
    }
    catch (error) {

      console.error('Error fetching movies:', error);
      res.status(409).json( { error: error.message } )
    }
}

const getMovie = async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const results = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [id])
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
}

const updateMovie = async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const { title, description, tag, actors, director, publish_date, img_url, trailer_url } = req.body
      const results = await pool.query(
        `UPDATE movies
        SET title = $1, description = $2, actors = $3, director = $4, publish_date = $5, img_url = $6, trailer_url = $7, tag = $8
        WHERE movie_id = $9`,
        [title, description, actors, director, publish_date, img_url, trailer_url, tag, id]
      )

      // Get tag_id
      const result_tagID = await pool.query(
        `SELECT tag_id FROM tags
        WHERE genre = $1`,
        [tag]
      )

      // Update movies_tags table
      const tag_id = result_tagID.rows[0].tag_id
      const tagResults = await pool.query(
        `UPDATE movies_tags
        SET tag_id = $1
        WHERE movie_id = $2`,
        [tag_id, id]
      )

      // Send response
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
}

const deleteMovie = async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const wishlist_movie_deletion = await pool.query(
        `DELETE FROM wishlist
        WHERE movie_id = $1`,
        [id]
      )

      // movies_tags table has "ON DELETE" keywords in query so it should be deleted as well
      const movies_tags_deletion = await pool.query(
        `DELETE FROM movies_tags
        WHERE movie_id = $1`,
        [id]
      )


      const results = await pool.query('DELETE FROM movies WHERE movie_id = $1', [id])
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }


export default {
    createMovie,
    getMovies,
    getMovie,
    updateMovie,
    deleteMovie
}