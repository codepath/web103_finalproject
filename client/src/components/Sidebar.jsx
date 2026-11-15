import { useState } from 'react'
import { NavLink, Link, useMatch } from 'react-router-dom'
import { useActiveUser } from '../context/ActiveUserContext.jsx'

export default function Sidebar() {
  const { activeUser, logout } = useActiveUser()
  const [logoutError, setLogoutError] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  async function handleLogout() {
    setSigningOut(true)
    setLogoutError('')
    try { await logout() } catch (error) { setLogoutError(error.message) }
    finally { setSigningOut(false) }
  }
  const tripMatch = useMatch('/trips/:tripId/*')
  const tripId = tripMatch && tripMatch.params.tripId !== 'new' ? tripMatch.params.tripId : null

  return (
    <aside className="sidebar">
      <Link to="/trips" className="sidebar-brand">TripTogether</Link>

      <nav className="sidebar-group" aria-label="Main">
        <NavLink to="/trips" end className="nav-link">All trips</NavLink>
      </nav>

      {tripId && (
        <nav className="sidebar-group" aria-label="This trip">
          <span className="sidebar-label">This trip</span>
          <NavLink to={`/trips/${tripId}`} end className="nav-link">Itinerary</NavLink>
          <NavLink to={`/trips/${tripId}/expenses`} className="nav-link">Expenses</NavLink>
          <NavLink to={`/trips/${tripId}/settings`} className="nav-link">Settings</NavLink>
        </nav>
      )}

      <div className="sidebar-spacer" />

      <div className="account-card">
        <div className="account-id">
          {activeUser.avatarUrl ? (
            <img className="avatar" src={activeUser.avatarUrl} alt="" width="36" height="36" />
          ) : (
            <span className="avatar avatar-fallback" aria-hidden="true">
              {activeUser.name.trim().charAt(0).toUpperCase()}
            </span>
          )}
          <span className="account-name">{activeUser.name}</span>
        </div>
        <button type="button" className="btn btn-small" disabled={signingOut} onClick={handleLogout}>
          {signingOut ? 'Logging out…' : 'Log out'}
        </button>
        {logoutError && <p className="error" role="alert">{logoutError}</p>}
      </div>
    </aside>
  )
}
