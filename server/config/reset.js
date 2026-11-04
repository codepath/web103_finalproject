import './dotenv.js';
import { fileURLToPath } from 'url';
import { pool } from './database.js';

import WallTypes from '../data/WallTypes.js';
import StartingRoutes from '../data/StartingRoutes.js';
import StartingHolds from '../data/StartingHolds.js';
import StartingRouteHolds from '../data/StartingRouteHolds.js';

const createWallTypesTable = async () => {
	const createQuery = `
		DROP TABLE IF EXISTS wall_types CASCADE;
		DROP TYPE IF EXISTS wall_angles;

		CREATE TYPE wall_angles AS ENUM ('slab', 'vertical', 'overhang', 'roof');

		CREATE TABLE IF NOT EXISTS wall_types (
			id SERIAL PRIMARY KEY,
			name wall_angles NOT NULL UNIQUE,
			min_angle INTEGER,
			max_angle INTEGER,
			description VARCHAR
		);
	`;

	try {
		await pool.query(createQuery);
		console.log('🎉 wall_types table created successfully');
	} catch (err) {
		console.error('⚠️ error creating wall_types table', err);
	}
};

const createClimbingHoldsTable = async () => {
	const createQuery = `
		DROP TABLE IF EXISTS climbing_holds CASCADE;
		DROP TYPE IF EXISTS hold_types;
		DROP TYPE IF EXISTS hold_sizes;

		CREATE TYPE hold_types AS ENUM ('crimp', 'jug', 'sloper', 'pocket', 'pinch');
		CREATE TYPE hold_sizes AS ENUM ('small', 'medium', 'large');

		CREATE TABLE IF NOT EXISTS climbing_holds (
			id SERIAL PRIMARY KEY,
			name VARCHAR NOT NULL,
			hold_type hold_types,
			size hold_sizes,
			color VARCHAR NOT NULL,
			image_url TEXT
		);
	`;

	try {
		await pool.query(createQuery);
		console.log('🎉 climbing_holds table created successfully');
	} catch (err) {
		console.error('⚠️ error creating climbing_holds table', err);
	}
};

const createClimbingRoutesTable = async () => {
	const createQuery = `
		DROP TABLE IF EXISTS climbing_routes CASCADE;
		DROP TYPE IF EXISTS grades;

		CREATE TYPE grades AS ENUM ('V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12');

		CREATE TABLE IF NOT EXISTS climbing_routes (
			id SERIAL PRIMARY KEY,
			name VARCHAR NOT NULL,
			grade grades NOT NULL,
			angle_degrees INTEGER NOT NULL,
			wall_type_id INTEGER NOT NULL REFERENCES wall_types(id),
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);
	`;

	try {
		await pool.query(createQuery);
		console.log('🎉 climbing_routes table created successfully');
	} catch (err) {
		console.error('⚠️ error creating climbing_routes table', err);
	}
};

const createRouteHoldsTable = async () => {
	const createQuery = `
		DROP TABLE IF EXISTS route_holds CASCADE;
		DROP TYPE IF EXISTS hold_roles;

		CREATE TYPE hold_roles AS ENUM ('start', 'hand', 'foot', 'any', 'finish');

		CREATE TABLE IF NOT EXISTS route_holds (
			id SERIAL PRIMARY KEY,
			route_id INTEGER NOT NULL REFERENCES climbing_routes(id) ON DELETE CASCADE,
			hold_id INTEGER NOT NULL REFERENCES climbing_holds(id) ON DELETE CASCADE,
			grid_row INTEGER NOT NULL CHECK (grid_row BETWEEN 0 AND 15),
			grid_col INTEGER NOT NULL CHECK (grid_col BETWEEN 0 AND 11),
			role hold_roles,
			rotation INTEGER NOT NULL DEFAULT 0,
			CONSTRAINT unique_hold_position_per_route UNIQUE (route_id, grid_row, grid_col)
		);
	`;

	try {
		await pool.query(createQuery);
		console.log('🎉 route_holds table created successfully');
	} catch (err) {
		console.error('⚠️ error creating route_holds table', err);
	}
};

// Explicit ids are inserted, so move the SERIAL sequence past them to avoid collisions on later inserts
const resetIdSequence = async (table) => {
	await pool.query(
		`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM ${table}`
	);
};

const seedWallTypesTable = async () => {
	await createWallTypesTable();

	const insertQuery = {
		text: 'INSERT INTO wall_types (id, name, min_angle, max_angle, description) VALUES ($1, $2, $3, $4, $5)',
	};

	for (const wallType of WallTypes) {
		const values = [wallType.id, wallType.name, wallType.min_angle, wallType.max_angle, wallType.description];

		try {
			await pool.query({ ...insertQuery, values });
			console.log(`✅ ${wallType.name} added successfully to wall_types`);
		} catch (err) {
			console.error(`⚠️ error inserting ${wallType.name} into wall_types`, err);
		}
	}

	try {
		await resetIdSequence('wall_types');
	} catch (err) {
		console.error('⚠️ error resetting wall_types id sequence', err);
	}
};

const seedClimbingHoldsTable = async () => {
	await createClimbingHoldsTable();

	const insertQuery = {
		text: 'INSERT INTO climbing_holds (id, name, hold_type, size, color, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
	};

	for (const hold of StartingHolds) {
		const values = [hold.id, hold.name, hold.hold_type, hold.size, hold.color, hold.image_url];

		try {
			await pool.query({ ...insertQuery, values });
			console.log(`✅ ${hold.name} added successfully to climbing_holds`);
		} catch (err) {
			console.error(`⚠️ error inserting ${hold.name} into climbing_holds`, err);
		}
	}

	try {
		await resetIdSequence('climbing_holds');
	} catch (err) {
		console.error('⚠️ error resetting climbing_holds id sequence', err);
	}
};

const seedClimbingRoutesTable = async () => {
	await createClimbingRoutesTable();

	const insertQuery = {
		text: 'INSERT INTO climbing_routes (id, name, grade, angle_degrees, wall_type_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
	};

	for (const route of StartingRoutes) {
		const values = [route.id, route.name, route.grade, route.angle_degrees, route.wall_type_id, route.created_at];

		try {
			await pool.query({ ...insertQuery, values });
			console.log(`✅ ${route.name} added successfully to climbing_routes`);
		} catch (err) {
			console.error(`⚠️ error inserting ${route.name} into climbing_routes`, err);
		}
	}

	try {
		await resetIdSequence('climbing_routes');
	} catch (err) {
		console.error('⚠️ error resetting climbing_routes id sequence', err);
	}
};

const seedRouteHoldsTable = async () => {
	await createRouteHoldsTable();

	const insertQuery = {
		text: 'INSERT INTO route_holds (id, route_id, hold_id, grid_row, grid_col, role, rotation) VALUES ($1, $2, $3, $4, $5, $6, $7)',
	};

	for (const routeHold of StartingRouteHolds) {
		const values = [
			routeHold.id,
			routeHold.route_id,
			routeHold.hold_id,
			routeHold.grid_row,
			routeHold.grid_col,
			routeHold.role,
			routeHold.rotation,
		];

		try {
			await pool.query({ ...insertQuery, values });
			console.log(`✅ route_hold ${routeHold.id} added successfully to route_holds`);
		} catch (err) {
			console.error(`⚠️ error inserting route_hold ${routeHold.id} into route_holds`, err);
		}
	}

	try {
		await resetIdSequence('route_holds');
	} catch (err) {
		console.error('⚠️ error resetting route_holds id sequence', err);
	}
};

// Order matters because of foreign keys: wall_types/climbing_holds -> climbing_routes -> route_holds
// Exported so the POST /api/routes/reset endpoint can reuse it
export const seedAllTables = async () => {
	await seedWallTypesTable();
	await seedClimbingHoldsTable();
	await seedClimbingRoutesTable();
	await seedRouteHoldsTable();
};

// Only seed and close the pool when run from the command line (node config/reset.js),
// not when the server imports this file
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await seedAllTables();
	await pool.end();
}
