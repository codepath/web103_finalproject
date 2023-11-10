import { pool } from '../config/database.js'

const createTag = async (req, res) => {
    try {
      const { genre } = req.body
  
      const results = await pool.query(
        `INSERT INTO tags (genre)
        VALUES($1) 
        RETURNING *`,
        [genre]
      )
      res.status(201).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
}

const getTags = async (req, res) => {
    try {
      const results = await pool.query('SELECT * FROM tags ORDER BY tag_id ASC')
      res.status(200).json(results.rows)
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
}

const getTag = async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const results = await pool.query('SELECT * FROM tags WHERE tag_id = $1', [id])
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
}

const updateTag = async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const { genre } = req.body
      const results = await pool.query(
        `UPDATE tags
        SET genre = $1
        WHERE id = $2`,
        [genre, id]
      )
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
}

const deleteTag = async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      
      const results = await pool.query('DELETE FROM tags WHERE id = $1', [id])
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
}

export default {
    createTag,
    getTags,
    getTag,
    updateTag,
    deleteTag
}