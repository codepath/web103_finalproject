// Placeholder fixture for a teams-directory endpoint that doesn't exist
// yet — the real /api/teams only covers 3 club teams in one league, not
// World Cup national teams grouped by confederation/group. Names,
// regions, and initial follow state come straight from the Figma frame;
// `group` isn't shown per-team there, just assigned round-robin so the
// Group A–F filter tabs have something to eventually filter against.
// `api_team_id` is a string (not `id`) to match the real followed_teams
// table's VARCHAR(50) column, since this list feeds Profile's real
// POST /api/follows call.
export const teams = [
  { api_team_id: '1', name: 'Argentina', region: 'South America', group: 'A', isFollowing: true },
  { api_team_id: '2', name: 'Brazil', region: 'South America', group: 'B', isFollowing: false },
  { api_team_id: '3', name: 'Germany', region: 'Europe', group: 'C', isFollowing: false },
  { api_team_id: '4', name: 'France', region: 'Europe', group: 'D', isFollowing: false },
  { api_team_id: '5', name: 'England', region: 'Europe', group: 'E', isFollowing: true },
  { api_team_id: '6', name: 'Spain', region: 'Europe', group: 'F', isFollowing: false },
  { api_team_id: '7', name: 'Netherlands', region: 'Europe', group: 'A', isFollowing: false },
  { api_team_id: '8', name: 'USA', region: 'North America', group: 'B', isFollowing: false },
]
