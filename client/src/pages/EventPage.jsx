import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatDate, priceTier } from '../format.js'
import { useAuth } from '../AuthContext.jsx'

function EventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
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
      navigate('/')
    } catch (err) {
      setDeleteError(err.message)
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
  if (!event) return <p className="status">Loading event…</p>

  const price = Number(event.price)
  // Only the creator sees Edit/Delete; the server enforces the same rule with a 403
  const isOwner = user?.id === event.created_by

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
      {((event.latitude != null && event.longitude != null) ||
        (event.address && event.city)) && (
        <a
          className="button"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.latitude},${event.longitude}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Maps
        </a>
      )}
      {event.website_url && (
        <a
          className="button"
          href={event.website_url}
          target="_blank"
          rel="noreferrer"
        >
          Visit venue website
        </a>
      )}
    </article>
  )
}

export default EventPage
