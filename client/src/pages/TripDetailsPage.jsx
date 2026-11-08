import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, formatDate, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'

export default function TripDetailsPage() {
  const { tripId } = useParams()
  const { activeUser } = useActiveUser()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setTrip(null)
    setError('')
    api(`/trips/${tripId}`).then(setTrip).catch((err) => setError(err.message))
  }, [tripId, activeUser.id])

  if (error) return <p className="error" role="alert">{error}</p>
  if (!trip) return <p className="page-note">Loading trip…</p>

  return (
    <section>
      <h1>{trip.title}</h1>
      <p className="page-note">
        {trip.destination} · {formatDate(trip.start_date)} – {formatDate(trip.end_date)} ·{' '}
        {formatMoney(trip.budget)} budget
      </p>
      <p>
        Invite code: <code className="code">{trip.invite_code}</code>
      </p>
    </section>
  )
}
