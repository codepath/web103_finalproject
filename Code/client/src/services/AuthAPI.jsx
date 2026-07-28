import { AUTH_ORIGIN } from '../config/api'

// OAuth lives on the API origin (port 3000 in dev), not behind the /api vite
// proxy, so these calls are cross-origin and must send the session cookie
// explicitly.
const AuthAPI = {
    // Returns the logged-in user, or null if this browser has no live session
    getSession: async () => {
        try {
            const res = await fetch(`${AUTH_ORIGIN}/auth/login/success`, {
                credentials: 'include'
            })
            if (!res.ok) return null
            const data = await res.json()
            return data.user ?? null
        } catch {
            return null
        }
    },

    logout: async () => {
        await fetch(`${AUTH_ORIGIN}/auth/logout`, { credentials: 'include' })
        localStorage.removeItem('matchlens_user')
    }
}

export default AuthAPI
