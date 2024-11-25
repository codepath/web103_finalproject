import { pool } from '../config/database.js'

const getAllSalons = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM salons')
        res.status(200).json(results.rows)
    } catch (error){
        res.status(409).json({ error: error.message })
    }
}

const getSalonById = async (req, res) => {
    const salon_id = req.params.salon_id;
    try {
        const results = await pool.query('SELECT * FROM salons WHERE id=$1', [salon_id])
        
        if (results.rows.length === 0){
            res.status(404).json({ error: "Salon not found" })

        } else {
            res.status(200).json(results.rows[0]);
        }
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default { getAllSalons, getSalonById }