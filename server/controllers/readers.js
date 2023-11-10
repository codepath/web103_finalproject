import { pool } from '../config/database.js'

// create a reader
const createReader = async (req, res) => {
    try {
        const { name, address, tel, bio } = req.body
        const results = await pool.query(
            `INSERT INTO readers ( name, address, tel, bio )
            VALUES( $1, $2, $3, $4 ) 
            RETURNING *`,
            [ name, address, tel, bio ]
        )
        res.status(201).json(results.rows[0])
    } catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const getReaders = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM readers ORDER BY id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(400).json( { error: error.message } )
    }
}

const getReaderById = async (req, res) => {
    try {
        const id = req.params.id
        const selectQuery = `SELECT name, address, tel, bio FROM readers WHERE id = ${id}`
        const results = await pool.query(selectQuery)
    
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json( { error: error.message } )
    }
}


export default {
    createReader,
    getReaders,
    getReaderById
}