import { footballApiGet } from "../config/footballApi.js";

function mapFixture(f) {
  return {
    id: f.fixture.id,
    home: f.teams.home.name,
    away: f.teams.away.name,
    home_score: f.goals.home,
    away_score: f.goals.away,
    status: f.fixture.status.short,
    minute: f.fixture.status.elapsed,
    date: f.fixture.date.slice(0, 10),
    venue: f.fixture.venue.name,
  };
}

export async function getAllMatches(req, res) {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const data = await footballApiGet(`/fixtures?date=${date}`);
    res.status(200).json(data.map(mapFixture));
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}

export async function getMatchById(req, res) {
  try {
    const data = await footballApiGet(`/fixtures?id=${req.params.id}`);
    if (!data.length) return res.status(404).json({ error: "Match not found" });
    res.status(200).json(mapFixture(data[0]));
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}
