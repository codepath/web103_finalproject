import { pool } from '../config/database.js'

const createReaderBook = async (req, res) => {
    try {
        const { reader_id, book_id } = req.body
        const result = await pool.query(`
        INSERT INTO readersbooks (reader_id, book_id)
        VALUES ($1, $2)
        RETURNING *
        `, [reader_id, book_id])
    } catch (error) {
        
    }
}

const getReadersBooks = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM readersbooks ORDER BY id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(400).json( { error: error.message } )
    }
}

const getAllBooks = async (request, response) => {
    try {
        const query = `
        SELECT *
        FROM books
        INNER JOIN readersbooks ON readersbooks.book_id = books.id
        WHERE readersbooks.reader_id = $1
        `

        const reader_id = parseInt(request.params.reader_id)
        const results = await pool.query(query, [reader_id])
        response.status(200).json(results.rows)
    } catch (error) {
        response.status(409).json({ error: error.message })
    }
}

const getAllReaders  = async (request, response) => {
    try {
        const query = `
        SELECT *
        FROM readers
        INNER JOIN readersbooks ON readersbook.reader_id = readers.id
        WHERE readerbooks.books_id = $1
        `
        
        const book_id = parseInt(request.params.book_id)
        const results = await pool.query(query, [book_id])
        response.status(200).json(results.rows)
    } catch (error) {
        response.status(409).json({ error: error.message })
    }
}

export default {
    createReaderBook,
    getReadersBooks,
    getAllBooks,
    getAllReaders
}