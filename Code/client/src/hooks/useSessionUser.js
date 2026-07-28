import { useState } from 'react'

// RequireAuth stores the session user here once the guard resolves (see
// components/RequireAuth.jsx), so any page under it can read the id/
// username/avatar for free instead of re-fetching /auth/login/success.
export function useSessionUser() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('matchlens_user'))
    } catch {
      return null
    }
  })
  return user
}
