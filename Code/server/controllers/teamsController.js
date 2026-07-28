// Teams come from the external football data API.

import { footballApiGet } from "../config/footballApi.js";

const LEAGUE_ID = 39;
// Free-tier API-Football plans only cover seasons 2022-2024, not the current one.
const SEASON = 2024;

function mapStandingRow(row) {
  return {
    id: row.team.id,
    name: row.team.name,
    league: "Premier League",
    played: row.all.played,
    wins: row.all.win,
    draws: row.all.draw,
    losses: row.all.lose,
    goals_scored: row.all.goals.for,
    points: row.points,
  };
}

// GET /api/teams — supports ?search=name
export async function getAllTeams(req, res) {
  try {
    const { search } = req.query;
    const data = await footballApiGet(
      `/standings?league=${LEAGUE_ID}&season=${SEASON}`,
    );
    let teams = data[0].league.standings[0].map(mapStandingRow);
    if (search)
      teams = teams.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()),
      );
    res.status(200).json(teams);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}

// GET /api/teams/:id — team information page data
export async function getTeamById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const data = await footballApiGet(
      `/standings?league=${LEAGUE_ID}&season=${SEASON}`,
    );
    const row = data[0].league.standings[0].find((r) => r.team.id === id);
    if (!row) return res.status(404).json({ error: "Team not found" });
    res.status(200).json(mapStandingRow(row));
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}
