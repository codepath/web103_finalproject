import { apiRequest } from "./client.js";

export function listCategories({ signal } = {}) {
  return apiRequest("/api/categories", { signal });
}
