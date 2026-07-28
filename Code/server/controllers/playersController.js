import { footballApiGet } from "../config/footballApi.js";

const LEAGUE_ID = 39;
// Free-tier API-Football plans only cover seasons 2022-2024, not the current one.
const SEASON = 2024;

function mapPlayer(entry) {
  const stats = entry.statistics[0];
  return {
    id: entry.player.id,
    name: entry.player.name,
    team: stats.team.name,
    position: stats.games.position,
    goals: stats.goals.total || 0,
    assists: stats.goals.assists || 0,
  };
}

export async function getAllPlayers(req, res) {
  try {
    const { search, sort } = req.query;
    const data = await footballApiGet(
      `/players/topscorers?league=${LEAGUE_ID}&season=${SEASON}`,
    );
    let players = data.map(mapPlayer);
    if (search)
      players = players.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    if (sort === "goals") players.sort((a, b) => b.goals - a.goals);
    res.status(200).json(players);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}

export async function getPlayerById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const data = await footballApiGet(
      `/players?id=${id}&season=${SEASON}&league=${LEAGUE_ID}`,
    );
    if (!data.length)
      return res.status(404).json({ error: "Player not found" });
    res.status(200).json(mapPlayer(data[0]));
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}
