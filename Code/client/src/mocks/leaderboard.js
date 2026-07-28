// Placeholder fixture for the Fan Leaderboard page, pending a real
// leaderboard endpoint. The existing /api/users only returns
// { id, username, email, points } — no location/title/team/trend
// concept at all, so this stays mocked. Rows straight from the Figma
// table (usernames, locations, titles, points, teams, trends).
export const leaderboard = [
  { rank: 1, username: 'TacticalPro_99', location: 'UK', title: 'Elite Scout', points: 24580, topTeam: 'Brazil', trend: 'up' },
  { rank: 2, username: 'GoalMachine', location: 'São Paulo, Brazil', title: 'Master Analyst', points: 22340, topTeam: 'Argentina', trend: 'up' },
  { rank: 3, username: 'FútbolGenius', location: 'Madrid, Spain', title: 'Rising Star', points: 21100, topTeam: 'Spain', trend: 'down' },
  { rank: 4, username: 'DerKaiser', location: 'Munich, Germany', title: 'Elite Scout', points: 19870, topTeam: 'Germany', trend: 'up' },
  { rank: 5, username: 'LesBleus_Fan', location: 'Paris, France', title: 'Veteran', points: 18450, topTeam: 'France', trend: 'up' },
  { rank: 6, username: 'AzzurriFaith', location: 'Milan, Italy', title: 'Veteran', points: 17200, topTeam: 'Italy', trend: 'down' },
  { rank: 7, username: 'SambaBoy', location: 'Rio, Brazil', title: 'Analyst', points: 16890, topTeam: 'Brazil', trend: 'up' },
  { rank: 8, username: 'OranjeHope', location: 'Amsterdam, Netherlands', title: 'Rising Star', points: 15340, topTeam: 'Netherlands', trend: 'down' },
  { rank: 9, username: 'ThreeLions', location: 'London, UK', title: 'Analyst', points: 14900, topTeam: 'England', trend: 'up' },
  { rank: 10, username: 'LaAlbiceleste', location: 'Buenos Aires', title: 'Scout', points: 14200, topTeam: 'Argentina', trend: 'up' },
]
