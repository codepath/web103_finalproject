import { pool } from '../config/database.js'

const createSneaker = async (req, res) => {
    try {
      const { brand_name, description, sizes, price, img_url } = req.body
  
      const results = await pool.query(
        `INSERT INTO sneakers (brand_name, description, sizes, price, img_url)
        VALUES($1, $2, $3, $4, $5) 
        RETURNING *`,
        [brand_name, description, sizes, price, img_url]
      )
      res.status(201).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }

const getSneakers = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM sneakers ORDER BY id ASC')
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(409).json( { error: error.message } )
    }
}
  
const getSneaker = async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const results = await pool.query('SELECT * FROM sneakers WHERE id = $1', [id])
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
}

const updateSneaker = async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const { brand_name, description, sizes, price, img_url } = req.body
      const results = await pool.query(
        `UPDATE sneakers
        SET brand_name = $1, description = $2, sizes = $3, price = $4, img_url = $5
        WHERE id = $6`,
        [brand_name, description, sizes, price, img_url]
      )
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }

export default {
    createSneaker,
    getSneakers,
    getSneaker,
    updateSneaker
  }
  