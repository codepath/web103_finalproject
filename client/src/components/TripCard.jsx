import { Link } from 'react-router-dom'
import { formatDate, formatMoney } from '../api.js'

export default function TripCard({ trip }) {
  return (
    <Link to={`/trips/${trip.id}`} className="card trip-card">
      <div className="trip-card-head">
        <h2>{trip.title}</h2>
        <span className="badge">{trip.role}</span>
      </div>
      <p>{trip.destination}</p>
      <p className="page-note">
        {formatDate(trip.start_date)} – {formatDate(trip.end_date)} · {formatMoney(trip.budget)} budget ·{' '}
        {trip.member_count} {trip.member_count === 1 ? 'member' : 'members'}
      </p>
    </Link>
  )
}
