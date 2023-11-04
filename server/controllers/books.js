import { pool } from '../config/database.js'

const getBooks = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM books ORDER BY id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(400).json( { error: error.message } )
    }
}

const getBookById = async (req, res) => {
    try {
      const id = req.params.id
      const selectQuery = `SELECT name, author, image, description FROM books WHERE id = ${id}`
      const results = await pool.query(selectQuery)
  
      res.status(200).json(results.rows[0])
    } catch (error) {
      res.status(409).json( { error: error.message } )
    }
}


export default {
    getBooks,
    getBookById
}