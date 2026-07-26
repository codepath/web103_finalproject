const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export const getArtists = ({ q = "", genre = "" } = {}) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (genre) params.set("genre", genre);
  const qs = params.toString();
  return request(`/artists${qs ? `?${qs}` : ""}`);
};

export const getArtist = (id) => request(`/artists/${id}`);

export const updateArtist = (id, data) =>
  request(`/artists/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteArtist = (id, userId) =>
  request(`/artists/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ user_id: userId }),
  });

export const getAdminOf = (userId) => request(`/users/${userId}/admin-of`);

export const getFollowing = (userId) => request(`/users/${userId}/following`);

export const followArtist = (userId, artistId, notify) =>
  request(`/follows`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      artist_id: artistId,
      notify_on_release: notify,
    }),
  });

export const unfollowArtist = (userId, artistId) =>
  request(`/follows/${artistId}?user_id=${userId}`, { method: "DELETE" });

export const getPostsByArtist = (artistId) =>
  request(`/artists/${artistId}/posts`);

export const getPost = (postId) => request(`/posts/${postId}`);

export const createPost = (userId, artistId, content) => {
  return request(`/artists/${artistId}/posts`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      artist_id: artistId,
      content: content,
    }),
  });
};

export const updatePost = (postId, userId, artistId, content) => {
  return request(`/posts/${postId}`, {
    method: "PATCH",
    body: JSON.stringify({
      user_id: userId,
      artist_id: artistId,
      content: content,
    }),
  });
};

export const deletePost = (postId, userId, artistId) => {
  return request(`/posts/${postId}`, {
    method: "DELETE",
    body: JSON.stringify({
      user_id: userId,
      artist_id: artistId,
    }),
  });
};

export const getMerch = ({ artist_id = "", type = "", sort = "" } = {}) => {
  const params = new URLSearchParams();
  if (artist_id) params.set("artist_id", artist_id);
  if (type) params.set("type", type);
  if (sort) params.set("sort", sort);
  const qs = params.toString();
  return request(`/merch${qs ? `?${qs}` : ""}`);
};

export const getArtistMerch = (artistId) =>
  request(`/artists/${artistId}/merch`);

export const createMerch = (artistId, data) =>
  request(`/artists/${artistId}/merch`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateMerch = (id, data) =>
  request(`/merch/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteMerch = (id, userId) =>
  request(`/merch/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ user_id: userId }),
  });
