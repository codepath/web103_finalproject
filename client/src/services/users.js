// Thin wrapper around the Users API (server/routes/users.js).
// No auth yet -- /me always resolves to the seeded current user (T1).

const BASE_URL = "/api/users";

const parseJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

// GET /api/users/me
export const fetchCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/me`);
  const body = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(body.error || "Failed to load profile.");
  }

  return body;
};

// PATCH /api/users/me
// Accepts the fields that are actually editable for a user: displayName and/or homeCurrency.
export const updateCurrentUser = async ({ displayName, homeCurrency }) => {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ displayName, homeCurrency }),
  });
  const body = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(body.error || "Failed to update profile.");
  }

  return body;
};
