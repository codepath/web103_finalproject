import { pool } from '../config/database.js'

const getBooks = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM books ORDER BY id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(400).json( { error: error.message } )
    }
}




export default {
    getBooks
}