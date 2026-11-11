// Base URL for the backend. Empty in development, where Vite proxies /api to
// the local server; set VITE_API_BASE_URL for production builds.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function readErrorMessage(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await response.json();
    if (typeof body?.error === "string") {
      return body.error;
    }
  }

  return `Request failed with status ${response.status}.`;
}

// Sends a request to the backend and returns the parsed JSON body.
// Network failures and non-2xx responses throw an ApiError; status 0 means
// the server could not be reached at all.
export async function apiRequest(path, { signal, ...options } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal,
      headers: { Accept: "application/json", ...options.headers },
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    throw new ApiError("Unable to reach the server. Please try again.", 0);
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
