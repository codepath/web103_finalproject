import { Link } from 'react-router-dom'
import { formatDate, formatMoney } from '../api.js'
import { tripLength, tripStatus } from '../travel.js'
import Icon from './Icon.jsx'

export default function TripCard({ trip }) {
  return (
    <Link to={`/trips/${trip.id}`} className="card trip-card">
      <div className={`trip-cover trip-cover-${trip.id % 3}`}>
        <img src="/images/journey-landscape.jpg" alt="" loading="lazy" width="1536" height="1024" />
        <span className="trip-status">{tripStatus(trip)}</span>
        <span className="trip-cover-place"><Icon name="pin" />{trip.destination}</span>
      </div>
      <div className="trip-card-body">
        <div className="trip-card-head"><span className="eyebrow">{tripLength(trip)} days of possibility</span><span className="badge">{trip.role}</span></div>
        <h2>{trip.title}</h2>
        <p className="trip-card-date"><Icon name="calendar" />{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</p>
        <div className="trip-card-footer">
          <span><Icon name="people" />{trip.member_count} {trip.member_count === 1 ? 'traveler' : 'travelers'}</span>
          <span>{formatMoney(trip.budget)} budget</span>
          <span className="card-arrow"><Icon name="arrow" /></span>
        </div>
      </div>
    </Link>
  )
}
