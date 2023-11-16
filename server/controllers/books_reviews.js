import { pool } from '../config/database.js'

const createBookReview = async (req, res) => {
    try {
        const { book_id, review_id } = req.body
        const results = await pool.query(`
        INSERT INTO books_reviews (book_id, review_id)
        VALUES ($1, $2)
        RETURNING *
        `, [book_id, review_id])
        
        res.status(201).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getBooksReviews = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM books_reviews ORDER BY book_id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(400).json( { error: error.message } )
    }
}

const getAllReviews = async (request, response) => {
    try {
        const query = `
        SELECT *
        FROM reviews
        INNER JOIN books_reviews ON books_reviews.review_id = reviews.id
        WHERE books_reviews.book_id = $1
        `

        const book_id = parseInt(request.params.book_id)
        const results = await pool.query(query, [book_id])
        response.status(200).json(results.rows)
    } catch (error) {
        response.status(409).json({ error: error.message })
    }
}



export default {
    createBookReview,
    getBooksReviews,
    getAllReviews
}