import { pool } from '../config/database.js'

const createMovie = async (req, res) => {
    try {
      const { title, description, actors, director, publish_date, img_url, trailer_url } = req.body
  
      const results = await pool.query(
        `INSERT INTO movies (title, description, actors, director, publish_date, img_url, trailer_url)
        VALUES($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [title, description, actors, director, publish_date, img_url, trailer_url]
      )
      res.status(201).json(results.rows[0])
    }
    catch (error) {
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
      const { title, description, actors, director, publish_date, img_url, trailer_url } = req.body
      const results = await pool.query(
        `UPDATE movies
        SET title = $1, description = $2, actors = $3, director = $4, publish_date = $5, img_url = $6, trailer_url = $7
        WHERE movie_id = $8`,
        [title, description, actors, director, publish_date, img_url, trailer_url, id]
      )
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