import "./dotenv.js";

const BASE_URL = "https://v3.football.api-sports.io";

export async function footballApiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": process.env.FOOTBALL_API_KEY },
  });
  if (!res.ok) throw new Error(`API-Football request failed: ${res.status}`);
  const body = await res.json();
  return body.response;
}
