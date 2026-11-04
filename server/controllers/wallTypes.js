import { pool } from '../config/database.js';

const getWallTypes = async (req, res) => {
	try {
		const results = await pool.query(
			'SELECT id, name, min_angle, max_angle, description FROM wall_types ORDER BY min_angle'
		);
		res.status(200).json(results.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default { getWallTypes };
