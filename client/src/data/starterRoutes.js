export const grades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8']

export const starterRoutes = [
  {
    id: 1,
    name: 'Sunrise Traverse',
    grade: 'V2',
    wallType: 'Vertical',
    holds: [
      { row: 14, col: 2, role: 'start', imageUrl: '/holds/jug-orange-medium.png', rotation: 0 },
      { row: 11, col: 4, role: 'hand', imageUrl: '/holds/crimp-small-yellow.png', rotation: 15 },
      { row: 8, col: 7, role: 'foot', imageUrl: '/holds/pinch-brown-small.png', rotation: 0 },
      { row: 4, col: 9, role: 'finish', imageUrl: '/holds/jug-green-large.png', rotation: 0 },
    ],
  },
  {
    id: 2,
    name: 'Blue Comet',
    grade: 'V4',
    wallType: 'Overhang',
    holds: [
      { row: 14, col: 9, role: 'start', imageUrl: '/holds/sloper-blue-large.png', rotation: 0 },
      { row: 11, col: 7, role: 'hand', imageUrl: '/holds/pocket-navyblue-small.png', rotation: -30 },
      { row: 8, col: 5, role: 'hand', imageUrl: '/holds/pinch-cyan-medium.png', rotation: 45 },
      { row: 4, col: 2, role: 'finish', imageUrl: '/holds/jug-babyblue-small.png', rotation: 0 },
    ],
  },
  {
    id: 3,
    name: 'Green Room',
    grade: 'V6',
    wallType: 'Slab',
    holds: [
      { row: 14, col: 5, role: 'start', imageUrl: '/holds/jug-green-large.png', rotation: 0 },
      { row: 11, col: 3, role: 'foot', imageUrl: '/holds/crimp-green-creditcard.png', rotation: 0 },
      { row: 8, col: 6, role: 'hand', imageUrl: '/holds/sloper-purple-medium.png', rotation: 90 },
      { row: 3, col: 10, role: 'finish', imageUrl: '/holds/pocket-purple-medium.png', rotation: 0 },
    ],
  },
]
