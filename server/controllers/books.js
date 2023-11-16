import { pool } from '../config/database.js'
import { URL } from 'url';
import imageSize from 'image-size';
import fetch from 'node-fetch';

const createBook = async (req, res) => {
    try {
        const { name, author, image, description } = req.body

        // Function to check if the URL points to a valid image
        const isValidImageURL = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    return false;
                }
                const buffer = await response.buffer();
                const dimensions = imageSize(buffer);
                return dimensions.width > 0 && dimensions.height > 0;
            } catch (error) {
                return false;
            }
        };

        // Validate the image URL
        const isValidURL = (string) => {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        };

        // Check if the image URL is valid and points to a valid image
        if (!isValidURL(image) || !(await isValidImageURL(image))) {
            return res.status(400).json({ error: 'Invalid image URL' });
        }

        const results = await pool.query(
            `INSERT INTO books ( name, author, image, description )
            VALUES( $1, $2, $3, $4 ) 
            RETURNING *`,
            [ name, author, image, description ]
        )
        res.status(201).json(results.rows[0])
        }
        catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

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

const updateBook= async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { name, author, image, description } = req.body

        // Function to check if the URL points to a valid image
        const isValidImageURL = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    return false;
                }
                const buffer = await response.buffer();
                const dimensions = imageSize(buffer);
                return dimensions.width > 0 && dimensions.height > 0;
            } catch (error) {
                return false;
            }
        };

        // Validate the image URL
        const isValidURL = (string) => {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        };

        // Check if the image URL is valid and points to a valid image
        if (!isValidURL(image) || !(await isValidImageURL(image))) {
            return res.status(400).json({ error: 'Invalid image URL' });
        }
        
        const results = await pool.query(
            `UPDATE books
            SET name = $1, author = $2, image = $3, description = $4
            WHERE id = $5`,
            [ name, author, image, description, id ]
        )
        res.status(200).json(results.rows[0])
        }
        catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const deleteBook = async (req, res) => {
    try {
            const id = parseInt(req.params.id)
            const review_deletion = await pool.query(
                `DELETE FROM reviews
                WHERE book_id = $1`,
                [id]
            )
            const results = await pool.query('DELETE FROM books WHERE id = $1', [id])
            res.status(200).json(results.rows[0])
        }
        catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

export default {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
}