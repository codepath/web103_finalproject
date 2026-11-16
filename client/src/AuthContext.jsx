import LoadingSpinner from './components/LoadingSpinner.jsx'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

// Login is a server route (Passport), so it needs a full page load, not a router <Link>
export const LOGIN_URL = '/auth/github'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function logout() {
    if (loggingOut) return

    setLoggingOut(true)

    try {
      const response = await fetch('/auth/logout', { method: 'POST' })

      if (!response.ok) {
        throw new Error(`Logout failed (HTTP ${response.status}).`)
      }

      setUser(null)
    } catch (error) {
      window.alert(error.message || 'Unable to log out. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, loggingOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

// Wrap a route element: logged-out visitors are sent to GitHub login.
// ponytail: after login the server redirects to "/", not back here. Passport resets the
// session on login, so a return path would have to travel in the OAuth `state` param.
export function RequireAuth({ children }) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) window.location.assign(LOGIN_URL)
  }, [loading, user])

  if (loading) return <LoadingSpinner label="Checking login..." />
  if (!user) return <p className="status">Redirecting to GitHub login…</p>
  return children
}
