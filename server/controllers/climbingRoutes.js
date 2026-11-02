import { pool } from '../config/database.js';
import { seedDatabase } from '../config/reset.js';

// Each route comes back with its wall type and an array of its placed holds
const SELECT_ROUTES = `
	SELECT
		cr.id,
		cr.name,
		cr.grade,
		cr.wall_type_id,
		wt.name AS wall_type,
		wt.angle_degrees,
		cr.created_at,
		COALESCE(
			json_agg(
				json_build_object(
					'routeHoldId', rh.id,
					'holdId', rh.hold_id,
					'imageUrl', ch.image_url,
					'gridRow', rh.grid_row,
					'gridCol', rh.grid_col,
					'role', rh.role,
					'rotation', rh.rotation
				) ORDER BY rh.id
			) FILTER (WHERE rh.id IS NOT NULL),
			'[]'
		) AS holds
	FROM climbing_routes cr
	JOIN wall_types wt ON wt.id = cr.wall_type_id
	LEFT JOIN route_holds rh ON rh.route_id = cr.id
	LEFT JOIN climbing_holds ch ON ch.id = rh.hold_id
`;

// Postgres errors caused by bad input (bad id, missing field, unknown hold, same spot twice)
const BAD_INPUT_CODES = ['22P02', '23502', '23503', '23505', '23514'];

const sendError = (res, error) => {
	const status = BAD_INPUT_CODES.includes(error.code) ? 400 : 500;
	res.status(status).json({ error: error.message });
};

// Save Check: a route needs a name, grade, wall type, and a start and finish hold
const validateRoute = ({ name, grade, wall_type_id, holds }) => {
	if (!name?.trim() || !grade || !wall_type_id) {
		return 'A route needs a name, grade, and wall type.';
	}
	if (!Array.isArray(holds)) {
		return 'A route needs a holds array.';
	}
	if (!holds.some((hold) => hold.role === 'start')) {
		return 'A route needs at least one start hold.';
	}
	if (!holds.some((hold) => hold.role === 'finish')) {
		return 'A route needs at least one finish hold.';
	}
	return null;
};

const insertRouteHolds = (client, routeId, holds) => {
	const values = [routeId];
	const rows = holds.map((hold) => {
		values.push(hold.holdId, hold.gridRow, hold.gridCol, hold.role, hold.rotation ?? 0);
		const n = values.length;
		return `($1, $${n - 4}, $${n - 3}, $${n - 2}, $${n - 1}, $${n})`;
	});

	return client.query(
		`INSERT INTO route_holds (route_id, hold_id, grid_row, grid_col, role, rotation)
		VALUES ${rows.join(', ')}`,
		values
	);
};

const findRoute = async (id) => {
	const results = await pool.query(`${SELECT_ROUTES} WHERE cr.id = $1 GROUP BY cr.id, wt.id`, [id]);
	return results.rows[0];
};

const getRoutes = async (req, res) => {
	try {
		const results = await pool.query(
			`${SELECT_ROUTES} GROUP BY cr.id, wt.id ORDER BY cr.created_at DESC`
		);
		res.status(200).json(results.rows);
	} catch (error) {
		sendError(res, error);
	}
};

const getRouteById = async (req, res) => {
	try {
		const route = await findRoute(req.params.id);
		if (!route) {
			return res.status(404).json({ error: 'Route not found.' });
		}
		res.status(200).json(route);
	} catch (error) {
		sendError(res, error);
	}
};

const createRoute = async (req, res) => {
	const message = validateRoute(req.body);
	if (message) {
		return res.status(400).json({ error: message });
	}

	const { name, grade, wall_type_id, holds } = req.body;
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const results = await client.query(
			'INSERT INTO climbing_routes (name, grade, wall_type_id) VALUES ($1, $2, $3) RETURNING id',
			[name.trim(), grade, wall_type_id]
		);
		const routeId = results.rows[0].id;
		await insertRouteHolds(client, routeId, holds);
		await client.query('COMMIT');

		res.status(201).json(await findRoute(routeId));
	} catch (error) {
		await client.query('ROLLBACK');
		sendError(res, error);
	} finally {
		client.release();
	}
};

const updateRoute = async (req, res) => {
	const message = validateRoute(req.body);
	if (message) {
		return res.status(400).json({ error: message });
	}

	const { id } = req.params;
	const { name, grade, wall_type_id, holds } = req.body;
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const results = await client.query(
			'UPDATE climbing_routes SET name = $1, grade = $2, wall_type_id = $3 WHERE id = $4',
			[name.trim(), grade, wall_type_id, id]
		);
		if (results.rowCount === 0) {
			await client.query('ROLLBACK');
			return res.status(404).json({ error: 'Route not found.' });
		}

		// Swap out all the old holds for the new ones
		await client.query('DELETE FROM route_holds WHERE route_id = $1', [id]);
		await insertRouteHolds(client, id, holds);
		await client.query('COMMIT');

		res.status(200).json(await findRoute(id));
	} catch (error) {
		await client.query('ROLLBACK');
		sendError(res, error);
	} finally {
		client.release();
	}
};

const deleteRoute = async (req, res) => {
	try {
		// route_holds rows go away on their own (ON DELETE CASCADE)
		const results = await pool.query(
			'DELETE FROM climbing_routes WHERE id = $1 RETURNING id',
			[req.params.id]
		);
		if (results.rowCount === 0) {
			return res.status(404).json({ error: 'Route not found.' });
		}
		res.status(200).json({ id: results.rows[0].id });
	} catch (error) {
		sendError(res, error);
	}
};

const resetRoutes = async (req, res) => {
	try {
		await seedDatabase();
		res.status(200).json({ message: 'Wall reset to starter routes.' });
	} catch (error) {
		sendError(res, error);
	}
};

export default {
	getRoutes,
	getRouteById,
	createRoute,
	updateRoute,
	deleteRoute,
	resetRoutes,
};
