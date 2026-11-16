import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import EventPage from './pages/EventPage.jsx'
import EventForm from './pages/EventForm.jsx'
import VenuesPage from './pages/VenuesPage.jsx'
import ManageListingsPage from './pages/ManageListingsPage.jsx'
import VenueForm from './pages/VenueForm.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Filters from './components/Filters.jsx'
import ResetButton from './components/ResetButton.jsx'
import { LOGIN_URL, RequireAuth, useAuth } from './AuthContext.jsx'
import './App.css'

function App() {
  // On the home page the header doubles as the filter bar and the grid runs edge to edge
  const isHome = useLocation().pathname === '/'
  const { user, loading, logout, loggingOut } = useAuth()

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">
          Local Bloom
        </Link>
        {isHome && <Filters />}
        <div className="header-actions">
          {!loading && user && (
            <Link to="/manage" className="secondary-button">
              Manage Listings
            </Link>
          )}
          <Link to="/events/new" className="post-button">
            <span className="post-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            Post
          </Link>
          {!loading &&
            (user ? (
              <>
                <ResetButton />
                <Link
                  to="/profile"
                  className="profile-link"
                  aria-label="My profile"
                >
                  {user.avatar_url && (
                    <img className="avatar" src={user.avatar_url} alt="" />
                  )}
                  <span className="username">{user.username}</span>
                </Link>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={logout}
                  disabled={loggingOut}
                >
                  {loggingOut ? 'Logging out...' : 'Log out'}
                </button>
              </>
            ) : (
              <a href={LOGIN_URL} className="secondary-button">
                Log in with GitHub
              </a>
            ))}
        </div>
      </header>
      <main className={isHome ? 'home' : undefined}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/manage"
            element={
              <RequireAuth>
                <ManageListingsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/venues"
            element={
              <RequireAuth>
                <VenuesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/venues/new"
            element={
              <RequireAuth>
                <VenueForm key="new" />
              </RequireAuth>
            }
          />
          <Route
            path="/venues/:id/edit"
            element={
              <RequireAuth>
                <VenueForm key="edit" />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          {/* Keys stop React reusing form state when switching between create and edit */}
          <Route
            path="/events/new"
            element={
              <RequireAuth>
                <EventForm key="new" />
              </RequireAuth>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <RequireAuth>
                <EventForm key="edit" />
              </RequireAuth>
            }
          />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="*" element={<p className="status">Page not found.</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App
