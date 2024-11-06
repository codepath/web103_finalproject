import { pool } from '../config/database.js';

const getDiets = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM diets`
        );
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching diets:', error);
        res.status(500).json({ message: 'Error fetching diets' });
    }
}

export default { getDiets }