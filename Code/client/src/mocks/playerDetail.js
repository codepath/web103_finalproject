// Placeholder fixture for the Player Detail page, pending a real
// /players/:id detail endpoint. The existing /api/players only has
// { id, name, team, position, goals, assists } — nothing close to
// bio/season-stats/MatchLens-score/market-value/career-history/
// attributes, so this page's data has to stay mocked. Owned by ticket
// #1 (shared), static layout only. getMockPlayerDetail overlays the
// requested :playerId onto it so the page still reflects the route
// param while the content stays static.

const basePlayer = {
  name: 'Martin Ødegaard',
  position: 'Midfielder',
  club: 'Arsenal FC',
  clubNumber: 8,
  nationalTeam: 'Norway National Team 🇳🇴 (2026 World Cup Squad)',
  age: 25,
  born: 'Drammen, Norway',
  height: '178cm',
  preferredFoot: 'Left',
  seasonLabel: '2025/26 Season',
  seasonStats: {
    goals: 11,
    assists: 14,
    appearances: 32,
    passAccuracy: '91%',
    keyPasses: 3.8,
    chancesCreated: 67,
  },
  matchLensScore: 94.2,
  scoreBlurb: '99th percentile for progressive passes among European midfielders.',
  scoreBadge: 'Top 1% Creative Midfielders in Europe',
  marketValue: '€95.0M',
  marketValuePrevious: '€82M',
  matchRating: 8.1,
  careerHistory: [
    { season: '2025/26', club: 'Arsenal', apps: 32, goals: 11, assists: 14, rating: 8.1 },
    { season: '2024/25', club: 'Arsenal', apps: 35, goals: 8, assists: 12, rating: 7.9 },
    { season: '2023/24', club: 'Arsenal', apps: 28, goals: 7, assists: 10, rating: 7.8 },
    { season: '2022/23', club: 'Arsenal', apps: 36, goals: 15, assists: 8, rating: 8.3 },
    { season: '2021/22', club: 'Arsenal', apps: 33, goals: 7, assists: 4, rating: 7.2 },
    { season: '2019/20', club: 'Real Madrid', apps: 7, goals: 0, assists: 2, rating: 6.4 },
  ],
  attributes: [
    { label: 'Vision', value: 96 },
    { label: 'Technique', value: 91 },
    { label: 'Passing', value: 92 },
    { label: 'Tactical IQ', value: 98 },
    { label: 'Dribbling', value: 88 },
    { label: 'Leadership', value: 85 },
  ],
  aiNote:
    'Ødegaard is among the most progressive passers in world football. His ability to receive between the lines and play incisive through-balls makes him the creative heartbeat of Arsenal. In the 2026 World Cup, he will be the key orchestrator for Norway, tasked with unlocking defenses in a tough Group B alongside Spain and Brazil.',
  groupLabel: 'Group B Standings',
  groupStandings: [
    { name: 'Spain 🇪🇸', points: 6 },
    { name: 'Brazil 🇧🇷', points: 4 },
    { name: 'Norway 🇳🇴', points: 3 },
    { name: 'Morocco 🇲🇦', points: 1 },
  ],
  internationalRecord: { caps: 62, goals: 9, assists: 18 },
}

export function getMockPlayerDetail(playerId) {
  return { ...basePlayer, id: playerId }
}
