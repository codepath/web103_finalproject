export const grades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8']

export const starterRoutes = [
  {
    id: 1,
    name: 'Sunrise Traverse',
    grade: 'V2',
    wallType: 'Vertical',
    holds: [
      { row: 14, col: 2, role: 'start', color: '#f97316' },
      { row: 11, col: 4, role: 'hand', color: '#f97316' },
      { row: 8, col: 7, role: 'foot', color: '#f97316' },
      { row: 4, col: 9, role: 'finish', color: '#f97316' },
    ],
  },
  {
    id: 2,
    name: 'Blue Comet',
    grade: 'V4',
    wallType: 'Overhang',
    holds: [
      { row: 14, col: 9, role: 'start', color: '#2563eb' },
      { row: 11, col: 7, role: 'hand', color: '#2563eb' },
      { row: 8, col: 5, role: 'hand', color: '#2563eb' },
      { row: 4, col: 2, role: 'finish', color: '#2563eb' },
    ],
  },
  {
    id: 3,
    name: 'Green Room',
    grade: 'V6',
    wallType: 'Slab',
    holds: [
      { row: 14, col: 5, role: 'start', color: '#16a34a' },
      { row: 11, col: 3, role: 'foot', color: '#16a34a' },
      { row: 8, col: 6, role: 'hand', color: '#16a34a' },
      { row: 3, col: 10, role: 'finish', color: '#16a34a' },
    ],
  },
]
