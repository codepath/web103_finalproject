import { pool } from '../config/database.js'


const createMovieTag = async (req, res) => {
    try {
      const { movie_id, tag_id } = req.body
      const results = await pool.query("INSERT INTO movies_tags (movie_id, tag_id) VALUES($1, $2) RETURNING *",
      [movie_id, tag_id])
  
      res.status(201).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json({ error: error.message })
    }
}

const getMoviesByTag = async (req, res) => {
    try {
        const query = `
          SELECT *
          FROM movies
          INNER JOIN movies_tags ON movies_tags.movie_id = movies.movie_id
          WHERE movies_tags.tag_id = $1
        `

        const tag_id = parseInt(req.params.tag_id)
        const results = await pool.query(query, [tag_id])
        res.status(200).json(results.rows)
      } catch (error) {
        res.status(409).json({ error: error.message })
      }
}

const getTagsByMovie = async (req, res) => {
    try {
        const query = `
          SELECT *
          FROM tags
          INNER JOIN movies_tags ON movies_tags.tag_id = tags.tag_id
          WHERE movies_tags.movie_id = $1
        `

        const movie_id = parseInt(req.params.movie_id)
        const results = await pool.query(query, [movie_id])
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const deleteMovieTag = async (req, res) => {
    try {
        const { movie_id, tag_id} = req.params

        const deleteMovieTagQuery = `
            DELETE FROM movies_tags
            WHERE movie_id = $1 AND tag_id = $2;
        `
        
        const results = await pool.query(deleteMovieTagQuery, [movie_id, tag_id])
        res.status(200).json(results.rows[0])
      }
      catch (error) {
        res.status(409).json( { error: error.message } )
      }
}




export default {
    createMovieTag,
    getMoviesByTag,
    getTagsByMovie,
    deleteMovieTag
}