const TREFLE_BASE = process.env.TREFLE_API_BASE || "https://trefle.io/api/v1";
const TREFLE_TOKEN = process.env.TREFLE_API_TOKEN || process.env.PLANT_API_KEY;

const ensureToken = () => {
  if (!TREFLE_TOKEN) {
    throw new Error("Missing TREFLE_API_TOKEN");
  }
};

const toFlowerCard = (plant) => ({
  id: plant.slug ?? String(plant.id ?? ""),
  slug: plant.slug ?? null,
  name: plant.common_name ?? plant.scientific_name ?? "Unknown",
  scientific_name: plant.scientific_name ?? null,
  flower_family: plant.family_common_name ?? null,
  image_url: plant.image_url ?? null,
  flower_meaning: null,
  description: null,
});

const matchesSearchQuery = (flower, searchQuery) => {
  const query = String(searchQuery || "").trim().toLowerCase();
  if (!query) return true;

  const haystacks = [
    flower.name,
    flower.scientific_name,
    flower.flower_family,
    flower.slug,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return haystacks.some((value) => value.includes(query));
};

const buildBaseQuery = ({ page, color, bloomMonth, growthHabit, sortBy, sortDir }) => {
  const params = new URLSearchParams();
  params.set("token", TREFLE_TOKEN);
  params.set("filter[flower_conspicuous]", "true");
  params.set("filter_not[image_url]", "null");

  if (page) params.set("page", String(page));
  if (color) params.set("filter[flower_color]", color);
  if (bloomMonth) params.set("filter[bloom_months]", bloomMonth);
  if (growthHabit) params.set("filter[growth_habit]", growthHabit);

  if (sortBy) {
    const direction = sortDir === "desc" ? "desc" : "asc";
    params.set(`order[${sortBy}]`, direction);
  }

  return params;
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok) {
    const message = json?.message || `Trefle API error (${response.status})`;
    throw new Error(message);
  }
  return json;
};

export const fetchDiscoverFlowers = async (query = {}) => {
  ensureToken();
  const params = buildBaseQuery(query);
  const endpoint = "plants";
  const url = `${TREFLE_BASE}/${endpoint}?${params.toString()}`;
  const json = await fetchJson(url);
  const mappedFlowers = (json.data ?? []).map(toFlowerCard);
  const filteredFlowers = query.search
    ? mappedFlowers.filter((flower) => matchesSearchQuery(flower, query.search))
    : mappedFlowers;

  return {
    data: filteredFlowers,
    links: json.links ?? {},
    meta: json.meta ?? {},
  };
};

export const fetchFlowerBySlug = async (slug) => {
  ensureToken();
  const params = new URLSearchParams({ token: TREFLE_TOKEN });
  const url = `${TREFLE_BASE}/plants/${encodeURIComponent(slug)}?${params.toString()}`;
  const json = await fetchJson(url);
  const plant = json.data ?? {};
  const species = plant.main_species ?? {};

  return {
    id: plant.slug ?? String(plant.id ?? slug),
    slug: plant.slug ?? slug,
    name: plant.common_name ?? plant.scientific_name ?? "Unknown",
    scientific_name: plant.scientific_name ?? null,
    description: species.specifications?.growth_form ?? null,
    flower_family: plant.family_common_name ?? null,
    flower_meaning: null,
    image_url: plant.image_url ?? null,
    genus: plant.genus ?? null,
    species: plant.species ?? null,
    order: plant.order ?? null,
    flower_colors: species.flower?.color ?? null,
    flower_array: species.flower?.conspicuous ?? null,
    bloom_months: species.growth?.bloom_months ?? null,
    growth_habit: species.specifications?.growth_habit ?? null,
  };
};

export const fetchFlowersFromAPI = async (maxPages = 10) => {
  const allFlowers = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const result = await fetchDiscoverFlowers({ page });
    allFlowers.push(...result.data);
    if (!result.links?.next) break;
  }
  return allFlowers;
};

/* -- Paused for now -- */
// export const fetchFlowersFromAPI = async (target = 300, maxPages = 20) => {
//   const key = process.env.PLANT_API_KEY;
//   const base = process.env.PLANT_API_BASE || 'https://perenual.com/api';
//   if (!key) throw new Error('Missing PLANT_API_KEY');

//   const flowers = [];
//   let page = 1;

//   while (flowers.length < target && page <= maxPages) {
//     const listUrl = `${base}/v2/species-list?key=${encodeURIComponent(key)}&page=${page}`;
//     let listJson;
//     try {
//       const listRes = await fetch(listUrl);
//       if (!listRes.ok) {
//         const txt = await listRes.text();
//         console.error('Species list fetch failed:', listUrl, listRes.status);
//         break;
//       }
//       listJson = await listRes.json();
//     } catch (err) {
//       console.error('Error fetching species list page', page, err);
//       break;
//     }

//     const list = Array.isArray(listJson.data) ? listJson.data : [];
//     if (list.length === 0) break;

//     // Gather ids and fetch details in small concurrent batches to avoid spiking rate limits
//     const ids = list.map((it) => it.id).filter(Boolean);
//     const concurrency = 5;
//     for (let i = 0; i < ids.length && flowers.length < target; i += concurrency) {
//       const batch = ids.slice(i, i + concurrency);
//       const promises = batch.map(async (id) => {
//         const detailUrl = `${base}/v2/species/details/${id}?key=${encodeURIComponent(key)}`;
//         try {
//           const detailRes = await fetch(detailUrl);
//           if (!detailRes.ok) {
//             const txt = await detailRes.text();
//             console.warn('Species detail fetch failed for id', id, detailRes.status, txt.slice(0,200));
//             return null;
//           }
//           return await detailRes.json();
//         } catch (err) {
//           console.error('Error fetching species detail for id', id, err);
//           return null;
//         }
//       });

//       const results = await Promise.all(promises);
//       for (const species of results) {
//         if (!species) continue;
//         if (species.flowers === 1) {
//           flowers.push({
//             id: species.id,
//             name: species.common_name ?? species.scientific_name?.[0] ?? null,
//             description: species.description ?? null,
//             flower_family: species.family ?? null,
//             flower_meaning: null,
//             image_url: species.default_image?.regular_url ?? species.default_image?.medium_url ?? null,
//             flowers: species.flowers ?? 1,
//           });
//           if (flowers.length >= target) break;
//         }
//       }
//     }

//     // stop if we've reached the last available page
//     if (page >= (listJson.meta?.last_page ?? page)) break;
//     page += 1;
//   }

//   return flowers.slice(0, target);
// };