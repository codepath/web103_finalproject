import { apiRequest } from "./client.js";

export function listTasks({ signal } = {}) {
  return apiRequest("/api/tasks", { signal });
}

export function getTask(taskId, { signal } = {}) {
  return apiRequest(`/api/tasks/${encodeURIComponent(taskId)}`, { signal });
}
