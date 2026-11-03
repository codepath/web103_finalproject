// Grid is 16 rows (0-15) x 12 columns (0-11). Row 0 is the top of the wall, row 15 is the floor.
const StartingRouteHolds = [
	// Route 1: Easy Test (V1) - dense, mostly jugs and pinches
	{ id: 1, route_id: 1, hold_id: 6, grid_row: 14, grid_col: 4, role: 'start', rotation: 0 },
	{ id: 2, route_id: 1, hold_id: 7, grid_row: 14, grid_col: 7, role: 'start', rotation: 0 },
	{ id: 3, route_id: 1, hold_id: 8, grid_row: 15, grid_col: 5, role: 'foot', rotation: 0 },
	{ id: 4, route_id: 1, hold_id: 6, grid_row: 12, grid_col: 3, role: 'hand', rotation: 0 },
	{ id: 5, route_id: 1, hold_id: 8, grid_row: 12, grid_col: 6, role: 'hand', rotation: 15 },
	{ id: 6, route_id: 1, hold_id: 7, grid_row: 13, grid_col: 9, role: 'foot', rotation: 0 },
	{ id: 7, route_id: 1, hold_id: 10, grid_row: 10, grid_col: 5, role: 'hand', rotation: 0 },
	{ id: 8, route_id: 1, hold_id: 6, grid_row: 9, grid_col: 8, role: 'hand', rotation: -10 },
	{ id: 9, route_id: 1, hold_id: 5, grid_row: 8, grid_col: 3, role: 'any', rotation: 0 },
	{ id: 10, route_id: 1, hold_id: 8, grid_row: 7, grid_col: 6, role: 'hand', rotation: 0 },
	{ id: 11, route_id: 1, hold_id: 7, grid_row: 5, grid_col: 5, role: 'hand', rotation: 0 },
	{ id: 12, route_id: 1, hold_id: 10, grid_row: 4, grid_col: 8, role: 'hand', rotation: 20 },
	{ id: 13, route_id: 1, hold_id: 6, grid_row: 3, grid_col: 4, role: 'hand', rotation: 0 },
	{ id: 14, route_id: 1, hold_id: 6, grid_row: 1, grid_col: 6, role: 'finish', rotation: 0 },

	// Route 2: Medium Test (V4) - mixed hold types, fewer holds
	{ id: 15, route_id: 2, hold_id: 12, grid_row: 14, grid_col: 5, role: 'start', rotation: 0 },
	{ id: 16, route_id: 2, hold_id: 9, grid_row: 14, grid_col: 7, role: 'start', rotation: 10 },
	{ id: 17, route_id: 2, hold_id: 10, grid_row: 12, grid_col: 3, role: 'foot', rotation: 0 },
	{ id: 18, route_id: 2, hold_id: 3, grid_row: 11, grid_col: 6, role: 'hand', rotation: 0 },
	{ id: 19, route_id: 2, hold_id: 15, grid_row: 9, grid_col: 3, role: 'hand', rotation: 30 },
	{ id: 20, route_id: 2, hold_id: 13, grid_row: 7, grid_col: 7, role: 'hand', rotation: -20 },
	{ id: 21, route_id: 2, hold_id: 4, grid_row: 6, grid_col: 4, role: 'any', rotation: 0 },
	{ id: 22, route_id: 2, hold_id: 11, grid_row: 4, grid_col: 6, role: 'hand', rotation: 90 },
	{ id: 23, route_id: 2, hold_id: 8, grid_row: 1, grid_col: 5, role: 'finish', rotation: 0 },

	// Route 3: Hard Test (V8) - sparse, small crimps and slopers
	{ id: 24, route_id: 3, hold_id: 1, grid_row: 13, grid_col: 5, role: 'start', rotation: 0 },
	{ id: 25, route_id: 3, hold_id: 4, grid_row: 13, grid_col: 7, role: 'start', rotation: 0 },
	{ id: 26, route_id: 3, hold_id: 9, grid_row: 11, grid_col: 6, role: 'foot', rotation: 0 },
	{ id: 27, route_id: 3, hold_id: 16, grid_row: 10, grid_col: 3, role: 'hand', rotation: 45 },
	{ id: 28, route_id: 3, hold_id: 12, grid_row: 8, grid_col: 8, role: 'hand', rotation: -30 },
	{ id: 29, route_id: 3, hold_id: 2, grid_row: 6, grid_col: 5, role: 'hand', rotation: 90 },
	{ id: 30, route_id: 3, hold_id: 15, grid_row: 4, grid_col: 7, role: 'hand', rotation: -45 },
	{ id: 31, route_id: 3, hold_id: 14, grid_row: 1, grid_col: 4, role: 'finish', rotation: 0 },
];

export default StartingRouteHolds;
