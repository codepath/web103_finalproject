import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AuthAPI from '../services/AuthAPI'

// Route guard for everything behind sign-in.
//
// The server session is the source of truth for every sign-in path, so this
// always revalidates. localStorage is only a hint that lets the first paint
// happen immediately — trusting it outright left a stale entry rendering the
// app as logged-in while every request was actually unauthenticated.
export default function RequireAuth() {
  const location = useLocation()

  // 'optimistic' paints the app straight away on the strength of the stored
  // hint, then downgrades to 'anonymous' if the server disagrees. Without a
  // hint there is nothing to paint, so block on the check instead of flashing
  // the dashboard at someone who is about to be redirected.
  const [status, setStatus] = useState(() =>
    localStorage.getItem('matchlens_user') ? 'optimistic' : 'checking'
  )

  useEffect(() => {
    let active = true

    AuthAPI.getSession().then((user) => {
      if (!active) return

      if (user) {
        localStorage.setItem('matchlens_user', JSON.stringify(user))
        setStatus('authed')
      } else {
        localStorage.removeItem('matchlens_user')
        setStatus('anonymous')
      }
    })

    return () => { active = false }
  }, [])

  if (status === 'checking') return null

  // `from` lets the login page send the user back where they were aiming.
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
