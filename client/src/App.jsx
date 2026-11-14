import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import TripsPage from './pages/TripsPage.jsx'
import CreateTripPage from './pages/CreateTripPage.jsx'
import TripDetailsPage from './pages/TripDetailsPage.jsx'
import ExpensesPage from './pages/ExpensesPage.jsx'
import TripSettingsPage from './pages/TripSettingsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Layout from './components/Layout.jsx'

import LoginPage from './pages/LoginPage.jsx'
import { useActiveUser } from './context/ActiveUserContext.jsx'

function RequireAuth() {
  const { activeUser, loading, error } = useActiveUser()
  if (loading) return <main className="main-content"><p role="status">Checking sign-in…</p></main>
  if (error) return <main className="main-content"><p role="alert">{error}</p><button onClick={() => window.location.reload()}>Try again</button></main>
  return activeUser ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/trips" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/new" element={<CreateTripPage />} />
          <Route path="/trips/:tripId" element={<TripDetailsPage />} />
          <Route path="/trips/:tripId/expenses" element={<ExpensesPage />} />
          <Route path="/trips/:tripId/settings" element={<TripSettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
