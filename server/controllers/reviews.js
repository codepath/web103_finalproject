import { pool } from '../config/database.js'

// create a review
const createReview = async (req, res) => {
    try {
        const reader_id = parseInt(req.params.reader_id);
        const book_id = parseInt(req.params.book_id)
        const { review, rating } = req.body
        const results = await pool.query(
            `INSERT INTO reviews ( review, rating, reader_id, book_id )
            VALUES( $1, $2, $3, $4 ) 
            RETURNING *`,
            [ review, rating, reader_id, book_id ]
        )
        res.status(201).json(results.rows[0])
        }
        catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const getReviews = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM reviews ORDER BY id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(400).json( { error: error.message } )
    }
}

const getReviewById = async (req, res) => {
    try {
        const id = req.params.id
        const selectQuery = `SELECT review, rating FROM reviews WHERE id = ${id}`
        const results = await pool.query(selectQuery)
    
        res.status(200).json(results.rows[0])
        } catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const updateReview = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { review, rating} = req.body
        const results = await pool.query(
            `UPDATE reviews
            SET review = $1, rating = $2
            WHERE id = $3`,
            [ review, rating, id ]
        )
        res.status(200).json(results.rows[0])
        }
        catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const deleteReview = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const results = await pool.query('DELETE FROM reviews WHERE id = $1', [id])
        res.status(200).json(results.rows[0])
        }
        catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

export default {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
}