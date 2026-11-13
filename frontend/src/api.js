// Small fetch wrapper for the Express API (proxied to /api in development)
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: "POST", body: body ?? {} }),
  patch: (p, body) => request(p, { method: "PATCH", body }),
  del: (p) => request(p, { method: "DELETE" }),
};

// Fetch recipes with optional filters, excluding empty or null values.
export const getRecipes = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();

  const path = query ? `/recipes?${query}` : "/recipes";
  return api.get(path);
};

//  Fetch a single recipe by ID
export const getRecipe = (id) => api.get(`/recipes/${id}`);

// Meal Planner API 

// Fetch planned meals 
export const getMealPlan = (start) => 
  api.get(`/meal-plan?start=${start}`); 

// add a recipe to meal plan 
export const addMealPlanEntry = (entry) => 
  api.post("/meal-plan", entry); 

// Change a planned meal's date/ meal type
export const updateMealPlanEntry = (id, changes) => 
  api.patch(`/meal-plan/${id}`, changes); 

// Remove a planned meal 
export const deleteMealPlanEntry = (id) => 
  api.del(`/meal-plan/${id}`); 