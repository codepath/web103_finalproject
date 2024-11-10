import { pool } from '../config/database.js'

const getAllSalons = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM salons')
        res.status(200).json(results)
    } catch (error){
        res.status(409).json({ error: error.message })
    }
}

const getSalonById = async (req, res) => {
    const salon_id = req.params.id;
    try {
        const results = await pool.query('SELECT * FROM salons WHERE id = $1', [salon_id])
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default { getAllSalons, getSalonById }