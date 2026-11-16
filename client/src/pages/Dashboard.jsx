import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { milesBetween } from '../format.js'
import EventCard from '../components/EventCard.jsx'
import EventQuickView from '../components/EventQuickView.jsx'

const getJson = (url) =>
  fetch(url).then((res) =>
    res.ok
      ? res.json()
      : Promise.reject(new Error(`Request failed (${res.status})`)),
  )

// Browser location, used for the distance shown on each tile and the distance filter
function useUserLocation() {
  const [location, setLocation] = useState(null)
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  const requestId = useRef(0)

  useEffect(() => {
    return () => {
      requestId.current += 1
    }
  }, [])

  const toggleLocation = () => {
    requestId.current += 1
    const currentRequest = requestId.current

    if (enabled) {
      setEnabled(false)
      setLocation(null)
      setLoading(false)
      setUnavailable(false)
      return
    }

    setEnabled(true)
    setLocation(null)
    setUnavailable(false)

    if (!navigator.geolocation) {
      setUnavailable(true)
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (requestId.current !== currentRequest) return

        setLocation({
          lat: coords.latitude,
          lng: coords.longitude,
        })

        setLoading(false)
      },
      () => {
        if (requestId.current !== currentRequest) return

        setLocation(null)
        setUnavailable(true)
        setLoading(false)
      },
      {
        maximumAge: 10 * 60 * 1000,
        timeout: 15000,
      },
    )
  }

  return {
    location,
    enabled,
    loading,
    unavailable,
    toggleLocation,
  }
}

// Container: fetches events and works out distances; EventCard draws each tile
function Dashboard() {
  // Filters are set by the header (?tier=$$&activity_type=Workshop&radius=10)
  const [searchParams] = useSearchParams()
  const radius = Number(searchParams.get('radius')) || null
  // Distance is filtered here in the browser, so leave it out of the API request
  const serverParams = new URLSearchParams(searchParams)
  serverParams.delete('radius')
  const query = serverParams.toString()

  const [events, setEvents] = useState(null)
  const [quickViewEvent, setQuickViewEvent] = useState(null)
  const quickViewTrigger = useRef(null)

  const openQuickView = (event, trigger) => {
    quickViewTrigger.current = trigger
    setQuickViewEvent(event)
  }

  const closeQuickView = () => {
    setQuickViewEvent(null)
    const trigger = quickViewTrigger.current
    if (trigger?.isConnected) {
      requestAnimationFrame(() => trigger.focus())
    }
  }
  const [error, setError] = useState(null)
  const { location, enabled, loading, unavailable, toggleLocation } = useUserLocation()

  useEffect(() => {
    let stale = false // ignore responses from an older filter combination
    getJson(`/api/events${query ? `?${query}` : ''}`)
      .then((data) => {
        if (!stale) {
          setEvents(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!stale) setError(err.message)
      })
    return () => {
      stale = true
    }
  }, [query])

  if (error) return <p className="status">Couldn't load events: {error}</p>
  if (!events) return <LoadingSpinner label="Loading events..." />

  const withDistance = events.map((event) => ({
    ...event,
    distance:
      location &&
      event.latitude != null &&
      event.longitude != null &&
      event.latitude !== '' &&
      event.longitude !== '' &&
      Number.isFinite(Number(event.latitude)) &&
      Number.isFinite(Number(event.longitude)) &&
      Math.abs(Number(event.latitude)) <= 90 &&
      Math.abs(Number(event.longitude)) <= 180
        ? milesBetween(location, {
            lat: Number(event.latitude),
            lng: Number(event.longitude),
          })
        : null,
  }))
  const visible =
    radius
      ? location
        ? withDistance.filter((e) => e.distance !== null && e.distance <= radius)
        : []
      : withDistance

  return (
    <>
      <div className="location-toggle-row">
        <button
          type="button"
          className={`location-toggle-button${enabled ? ' is-enabled' : ''}`}
          onClick={toggleLocation}
          aria-pressed={enabled}
          title={enabled ? 'Disable location' : 'Enable location'}
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          {loading ? 'Locating...' : enabled ? 'Location On' : 'Location Off'}
        </button>
      </div>

      {enabled && unavailable && (
        <p className="notice">
          Location unavailable. Allow location access in your browser's
          site settings, then turn location off and on again.
        </p>
      )}
      {radius && !location && (
        <p className="notice">
          {!enabled
            ? 'Turn on location above to filter by distance.'
            : unavailable
              ? 'Location unavailable. Check your browser location permission.'
              : 'Finding your location…'}
        </p>
      )}
      {radius && !location ? null : !visible.length ? (
        <p className="status">No events match these filters.</p>
      ) : (
        <div className="tile-grid">
          {visible.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              distance={event.distance}
              onQuickView={openQuickView}
            />
          ))}
        </div>
      )}
      {quickViewEvent && (
        <EventQuickView event={quickViewEvent} onClose={closeQuickView} />
      )}
    </>
  )
}

export default Dashboard
