import { apiRequest } from "./client.js";

// The app has no login yet, so new tasks belong to the seeded demo user.
const DEMO_USER_ID = Number(import.meta.env.VITE_DEMO_USER_ID ?? 1);

function jsonRequest(method, body, signal) {
  return {
    method,
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// query: { completed, priority, category, sort, order } — empty values are skipped.
export function listTasks(query = {}, { signal } = {}) {
  const params = new URLSearchParams();

  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(name, value);
    }
  }

  const search = params.toString();
  return apiRequest(`/api/tasks${search ? `?${search}` : ""}`, { signal });
}

export function getTask(taskId, { signal } = {}) {
  return apiRequest(`/api/tasks/${encodeURIComponent(taskId)}`, { signal });
}

export function createTask(fields, { signal } = {}) {
  return apiRequest(
    "/api/tasks",
    jsonRequest("POST", { ...fields, user_id: DEMO_USER_ID }, signal),
  );
}

export function updateTask(taskId, fields, { signal } = {}) {
  return apiRequest(
    `/api/tasks/${encodeURIComponent(taskId)}`,
    jsonRequest("PATCH", fields, signal),
  );
}

export function deleteTask(taskId, { signal } = {}) {
  return apiRequest(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: "DELETE",
    signal,
  });
}
