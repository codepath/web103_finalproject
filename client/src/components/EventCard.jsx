import { Link } from 'react-router-dom'
import { formatShortDate, priceTier } from '../format.js'

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

// Presenter: one tile in the home grid. distance is in miles, or null when unknown.
function EventCard({ event, distance }) {
  return (
    <Link to={`/events/${event.id}`} className="tile">
      {event.images[0] ? (
        <img src={event.images[0]} alt="" loading="lazy" />
      ) : (
        <div className="img-placeholder" aria-hidden="true">
          🌸
        </div>
      )}
      <div className="tile-info">
        <h2>{event.title}</h2>
        <p className="tile-type">{event.activity_type}</p>
        <p className="tile-meta">
          {distance !== null && (
            <span>
              <PinIcon />{' '}
              {distance < 10 ? distance.toFixed(1) : Math.round(distance)} mi
            </span>
          )}
          <span>{priceTier(event.price)}</span>
          <span>{formatShortDate(event.start_time)}</span>
        </p>
      </div>
    </Link>
  )
}

export default EventCard
