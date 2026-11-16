import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { formatDate, priceTier } from '../format.js'
import LoadingSpinner from './LoadingSpinner.jsx'

function EventQuickView({ event, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/events/${event.id}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        return response.json()
      })
      .then(setDetails)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })

    return () => controller.abort()
  }, [event.id])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusable = Array.from(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )

      if (!focusable.length) {
        e.preventDefault()
        panel.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!panel.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const item = details || event
  const price = Number(item.price)

  return createPortal(
    <div className="lb-quick-view-root">
      <div
        className="lb-quick-view-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        className="lb-quick-view-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lb-quick-view-title"
        tabIndex={-1}
      >
        <div className="lb-quick-view-header">
          <span className="pill">Quick View</span>
          <button
            ref={closeRef}
            type="button"
            className="secondary-button"
            onClick={onClose}
            aria-label="Close quick view"
          >
            ×
          </button>
        </div>

        {item.images?.[0] && (
          <img className="lb-quick-view-image" src={item.images[0]} alt="" />
        )}

        <h2 id="lb-quick-view-title">{item.title}</h2>
        <p className="muted">{item.activity_type}</p>

        {error && (
          <p role="alert" className="form-error">
            Unable to load additional details: {error}
          </p>
        )}

        {!details && !error && (
          <LoadingSpinner label="Loading event details..." />
        )}

        <dl className="lb-quick-view-details">
          <dt>When</dt>
          <dd>{formatDate(item.start_time)}</dd>
          <dt>Price</dt>
          <dd>
            {price === 0 ? 'Free' : `$${price.toFixed(2)} (${priceTier(price)})`}
          </dd>
          {item.venue_name && (
            <>
              <dt>Venue</dt>
              <dd>{item.venue_name}</dd>
            </>
          )}
          {item.city && (
            <>
              <dt>City</dt>
              <dd>{item.city}</dd>
            </>
          )}
        </dl>

        {item.description && <p>{item.description}</p>}

        {item.tags?.length > 0 && (
          <ul className="tags">
            {item.tags.map((tag) => <li key={tag}>#{tag}</li>)}
          </ul>
        )}

        <Link
          to={`/events/${event.id}`}
          className="button lb-quick-view-details-link"
          onClick={onClose}
        >
          View Full Details
        </Link>
      </aside>
    </div>,
    document.body,
  )
}

export default EventQuickView