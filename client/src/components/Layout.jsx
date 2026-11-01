import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import { useActiveUser } from '../context/ActiveUserContext.jsx'

export default function Layout() {
  const { activeUser } = useActiveUser()

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Outlet />
        <p className="page-note">Signed in as {activeUser.name}</p>
      </main>
    </div>
  )
}
