import { NavLink, Link, useMatch } from 'react-router-dom'
import { useActiveUser } from '../context/ActiveUserContext.jsx'

export default function Sidebar() {
  const { users, activeUser, setActiveUserId } = useActiveUser()
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

      <div className="user-switcher">
        <label htmlFor="active-user">Acting as (demo user)</label>
        <select
          id="active-user"
          value={activeUser.id}
          onChange={(event) => setActiveUserId(Number(event.target.value))}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
    </aside>
  )
}
