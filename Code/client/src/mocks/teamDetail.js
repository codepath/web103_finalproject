// Placeholder fixture for the Team Detail page, pending a real
// /teams/:id detail endpoint. The existing /api/teams only has
// { name, league, played, wins, draws, losses, goals_scored, points }
// for 3 club teams — no badge/stadium/form/fixtures/roster concept at
// all, so this page's data has to stay mocked, same reasoning as the
// Match Detail page. getMockTeamDetail overlays the requested :teamId
// onto it so the page still reflects the route param.

const baseTeam = {
  name: 'Argentina',
  tagline: 'FIFA World Cup 2026 · 3x Champions (1978, 1986, 2022)',
  meta: '🏟 Multiple Venues (USA, Canada & Mexico) · 📍 South America · 👥 8.2M Followers',
  isFollowing: true,
  groupLabel: 'Group C Standings',
  recentForm: [
    { result: 'W', score: '3-0' },
    { result: 'W', score: '2-1' },
    { result: 'W', score: '1-0' },
    { result: 'L', score: '0-1' },
    { result: 'W', score: '2-0' },
  ],
  metrics: { goalDifference: '+7 GD', goalsScored: 10, goalsConceded: 3 },
  upcomingFixtures: [
    { date: 'Sat, 19 Jul', time: '18:00', homeTeam: 'Argentina', awayTeam: 'France', venue: 'MetLife Stadium, New Jersey' },
    { date: 'Wed, 23 Jul', time: '20:00', homeTeam: 'Winner QF1', awayTeam: 'Argentina', venue: 'AT&T Stadium, Dallas' },
    { date: 'Sun, 27 Jul', time: '18:00', homeTeam: 'Semi-Final TBD', awayTeam: 'Argentina', venue: 'MetLife Stadium' },
  ],
  standings: [
    { rank: 1, name: 'Argentina', points: 9 },
    { rank: 2, name: 'Poland', points: 4 },
    { rank: 3, name: 'Saudi Arabia', points: 3 },
  ],
  roster: [
    { id: 1, name: 'Lionel Messi', position: 'CAM', goals: 4, assists: 3 },
    { id: 2, name: 'Julián Álvarez', position: 'ST', goals: 3, assists: 1 },
    { id: 3, name: 'Enzo Fernández', position: 'CM', goals: 1, assists: 2 },
    { id: 4, name: 'Emiliano Martínez', position: 'GK', goals: 0, assists: 0 },
    { id: 5, name: 'Cristian Romero', position: 'CB', goals: 1, assists: 0 },
  ],
}

export function getMockTeamDetail(teamId) {
  return { ...baseTeam, id: teamId }
}
