// Fetches flowers from external API and maps them to your DB schema
const API_BASE = process.env.PLANT_API_BASE;

export const fetchFlowersFromAPI = async (page = 1) => {
  const res = await fetch(`${API_BASE}/search?page=${page}&type=flower`, {
    headers: { Authorization: `Bearer ${process.env.PLANT_API_KEY}` },
  });

  const json = await res.json();

  return json.results.map((plant) => ({
    name: plant.common_names?.[0] ?? plant.scientific_name,
    description: null,
    flower_family: plant.family_name ?? null,
    flower_meaning: null,
    image_url: plant.preferred_image_url ?? null,
  }));
};
