import { pool } from '../config/database.js';

const getHolds = async (req, res) => {
	try {
		const results = await pool.query(
			'SELECT * FROM climbing_holds ORDER BY hold_type, size'
		);
		res.status(200).json(results.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default { getHolds };
