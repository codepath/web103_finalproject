// Where the client talks to the API.
//
// Two constants because the two route families reach the server differently.

// /api/* is same-origin in both environments: the Vite proxy forwards it in
// dev, and Express serves the built client itself in prod. A relative path is
// therefore correct everywhere, and only a split deploy needs VITE_API_URL.
export const API_URL = import.meta.env.VITE_API_URL ?? ''

// /auth/* is not proxied. The GitHub OAuth round trip has to come back to the
// API's own origin for the session cookie to be set there, so in dev these
// calls have to name that origin explicitly — which also makes them
// cross-origin, which is why AuthAPI sends credentials. In prod the client is
// served by the same Express process, so same-origin applies again.
export const AUTH_ORIGIN =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:3000')
