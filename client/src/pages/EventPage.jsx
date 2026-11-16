import { useToast } from '../context/ToastContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatDate, priceTier } from '../format.js'
import { useAuth } from '../AuthContext.jsx'

function EventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${event.title}"? This can't be undone.`))
      return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      // 404 means it's already gone, which is the outcome the user wanted
      if (!res.ok && res.status !== 404)
        throw new Error(`Delete failed (${res.status})`)
      toast.success('Event deleted successfully.')
      navigate('/')
    } catch (err) {
      setDeleteError(err.message)
      toast.error(err.message)
      setDeleting(false)
    }
  }

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject(
              new Error(
                res.status === 404
                  ? 'Event not found'
                  : `Request failed (${res.status})`,
              ),
            ),
      )
      .then(setEvent)
      .catch((err) => setError(err.message))
  }, [id])

  if (error)
    return (
      <p className="status">
        {error}. <Link to="/">Back to events</Link>
      </p>
    )
  if (!event) return <LoadingSpinner label="Loading event..." />

  const price = Number(event.price)
  // Only the creator sees Edit/Delete; the server enforces the same rule with a 403
  const isOwner = user?.id === event.created_by

  const hasCoordinates =
    event.latitude != null &&
    event.longitude != null &&
    event.latitude !== '' &&
    event.longitude !== '' &&
    Number.isFinite(Number(event.latitude)) &&
    Number.isFinite(Number(event.longitude)) &&
    Number(event.latitude) >= -90 &&
    Number(event.latitude) <= 90 &&
    Number(event.longitude) >= -180 &&
    Number(event.longitude) <= 180

  const hasAddress = Boolean(event.address?.trim() && event.city?.trim())

  const mapsQuery = hasCoordinates
    ? `${event.latitude},${event.longitude}`
    : hasAddress
      ? `${event.address}, ${event.city}`
      : null

  const mapsUrl = mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
    : null

  const websiteUrl =
    typeof event.website_url === 'string' &&
    /^https?:\/\//i.test(event.website_url.trim())
      ? event.website_url.trim()
      : null

  return (
    <article className="event-page">
      <div className="event-page-top">
        <Link to="/" className="back">
          ← All events
        </Link>
        {isOwner && (
          <div className="event-actions">
            <Link to={`/events/${id}/edit`} className="secondary-button">
              Edit
            </Link>
            <button
              type="button"
              className="secondary-button danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      {deleteError && (
        <p className="form-error" role="alert">
          {deleteError}
        </p>
      )}
      {event.images[0] && <img className="hero" src={event.images[0]} alt="" />}

      <span className="pill">{event.activity_type}</span>
      <h1>{event.title}</h1>
      <ul className="tags">
        {event.tags.map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>

      <dl className="details">
        <dt>When</dt>
        <dd>
          {formatDate(event.start_time)} – {formatDate(event.end_time)}
        </dd>
        <dt>Price</dt>
        <dd>
          {price === 0 ? 'Free' : `$${price.toFixed(2)} (${priceTier(price)})`}
        </dd>
        <dt>Where</dt>
        <dd>
          {event.venue_name}
          <br />
          {event.address}, {event.city}
        </dd>
        <dt>Venue hours</dt>
        <dd>{event.hours}</dd>
      </dl>

      <h2>What you'll do</h2>
      <p>{event.description}</p>
      <h2>What to bring</h2>
      <p>{event.what_to_bring}</p>
      <div className="venue-actions">
        {mapsUrl ? (
          <a
            className="button venue-action"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Maps
          </a>
        ) : (
          <button
            type="button"
            className="button venue-action"
            disabled
            title="Venue location unavailable"
          >
            Open in Maps
          </button>
        )}
        {websiteUrl ? (
          <a
            className="button venue-action"
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit venue website
          </a>
        ) : (
          <button
            type="button"
            className="button venue-action"
            disabled
            title="Venue website unavailable"
          >
            Visit venue website
          </button>
        )}
      </div>
    </article>
  )
}

export default EventPage
