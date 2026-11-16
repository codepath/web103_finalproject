import Spinner from '../components/Spinner.jsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import TripCard from '../components/TripCard.jsx'
import JoinTripForm from '../components/JoinTripForm.jsx'
import Icon from '../components/Icon.jsx'

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
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="small-sun" /> THE NEXT CHAPTER</span>
          <h1>Good trips start with<br /><em>great company.</em></h1>
          <p>Your people, your plans, your next adventure.<br className="desktop-break" /> Bring it all together in one happy place.</p>
          <Link to="/trips/new" className="btn btn-primary"><Icon name="plus" />Plan a new trip</Link>
        </div>
        <div className="hero-art"><img src="/images/journey-landscape.jpg" alt="Illustrated mountains, a lake, and a train winding toward a coastal town" width="1536" height="1024" /><span className="hero-stamp"><Icon />TAKE THE SCENIC ROUTE</span></div>
      </div>

      <div className="page-head collection-heading"><div><span className="eyebrow">YOUR COLLECTION</span><h2>Your trips</h2><p className="page-note">A little planning. A lot to look forward to.</p></div>{trips && <span className="collection-count">{String(trips.length).padStart(2, '0')} {trips.length === 1 ? 'journey' : 'journeys'}</span>}</div>
      {error && <p className="error" role="alert">{error}</p>}
      {!error && trips === null && <Spinner label="Loading trips…" />}
      {trips && trips.length === 0 && (
        <div className="empty-state"><Icon name="compass" /><h3>Your next chapter is waiting.</h3><p>No trips yet. Plan a new trip or join your friends with an invite code.</p></div>
      )}
      {trips && (
        <>
          <div className="trip-grid">{trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>
          <JoinTripForm />
        </>
      )}
    </section>
  )
}
