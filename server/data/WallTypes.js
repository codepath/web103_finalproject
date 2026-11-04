const WallTypes = [
	{
		id: 1,
		name: 'slab',
		min_angle: -20,
		max_angle: -1,
		description: 'Gentle angle that leans slightly away, taps into balance and precise footwork',
	},
	{
		id: 2,
		name: 'vertical',
		min_angle: 0,
		max_angle: 5,
		description: 'Relatively straight up and down, climbers utilize strength and technique abilities.',
	},
	{
		id: 3,
		name: 'overhang',
		min_angle: 6,
		max_angle: 50,
		description: 'Leans at an angle steeper than vertical, adds an increased need for body tension and power.',
	},
	{
		id: 4,
		name: 'roof',
		min_angle: 51,
		max_angle: 90,
		description: 'Steepest wall angle, often nearing horizontal – calls for controlled core strength and increased pulling footwork.',
	},
];

export default WallTypes;
