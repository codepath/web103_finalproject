import { Routes, Route, Navigate } from 'react-router-dom'
import TripsPage from './pages/TripsPage.jsx'
import CreateTripPage from './pages/CreateTripPage.jsx'
import TripDetailsPage from './pages/TripDetailsPage.jsx'
import ExpensesPage from './pages/ExpensesPage.jsx'
import TripSettingsPage from './pages/TripSettingsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/trips" replace />} />
      <Route path="/trips" element={<TripsPage />} />
      <Route path="/trips/new" element={<CreateTripPage />} />
      <Route path="/trips/:tripId" element={<TripDetailsPage />} />
      <Route path="/trips/:tripId/expenses" element={<ExpensesPage />} />
      <Route path="/trips/:tripId/settings" element={<TripSettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
