import { Link, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Icon from './Icon.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  const section = pathname.endsWith('/expenses') ? 'Expenses' : pathname.endsWith('/settings') ? 'Trip settings' : pathname === '/trips/new' ? 'New trip' : pathname === '/trips' ? null : 'Itinerary'

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="workspace">
        <header className="workspace-header">
          <div className="breadcrumbs"><Link to="/trips">My trips</Link>{section && <><span aria-hidden="true">/</span><span>{section}</span></>}</div>
          <span className="workspace-caption"><Icon name="leaf" />A little further, together.</span>
        </header>
        <main className="main-content"><Outlet /></main>
        <footer className="app-footer"><span>TripTogether</span><span>For the places. For the people.</span></footer>
      </div>
    </div>
  )
}
