import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import TripCard from '../components/TripCard.jsx'

export default function TripsPage() {
  const { activeUser } = useActiveUser()
  const [trips, setTrips] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setTrips(null)
    setError('')
    api('/trips').then(setTrips).catch((err) => setError(err.message))
  }, [activeUser.id])

  return (
    <section>
      <div className="page-head">
        <h1>Trips</h1>
        <Link to="/trips/new" className="btn btn-primary">New trip</Link>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {!error && trips === null && <p className="page-note">Loading trips…</p>}
      {trips && trips.length === 0 && (
        <p className="page-note">No trips yet. Create one to start planning.</p>
      )}
      {trips && (
        <div className="stack">
          {trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
        </div>
      )}
    </section>
  )
}
