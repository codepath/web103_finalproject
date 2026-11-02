import { pool } from '../config/database.js';

const getWallTypes = async (req, res) => {
	try {
		const results = await pool.query(
			'SELECT id, name, angle_degrees, description FROM wall_types ORDER BY angle_degrees'
		);
		res.status(200).json(results.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default { getWallTypes };
