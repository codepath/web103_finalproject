import { pool } from '../config/database.js'

const createBookUser = async (req, res) => {
  try {

    const book_id = parseInt(req.params.book_id)
    const { username } = req.body

    const results = await pool.query(`
      INSERT INTO users_books (book_id, username)
      VALUES($1, $2)
      RETURNING *`,
      [book_id, username]
    )

    res.status(200).json(results.rows[0])
    console.log('🆕 added user to book')

  }
  catch (error) {
    res.status(409).json( { error: error.message } )
    console.log('Error:', error.message)
  }
}


const getBookUsers = async (req, res) => {
  try {
    const book_id = parseInt(req.params.book_id)
    const results = await pool.query(
      'SELECT * FROM users_books WHERE book_id = $1',
      [book_id]

    )

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json( { error: error.message } )
    console.log('🚫 unable to GET all users (travelers) - Error:', error.message)
  }
}


const getUserBooks = async (req, res) => {
  try {
    const username = req.params.username
    const results = await pool.query(`
      SELECT books.* FROM users_books, books
      WHERE users_books.book_id = books.id
      AND users_books.username = $1`,

      [username]
    )

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json( { error: error.message } )
    console.log('🚫 unable to GET users trips - Error:', error.message)
  }
}

export default {
  createBookUser,
  getBookUsers,
  getUserBooks
}

