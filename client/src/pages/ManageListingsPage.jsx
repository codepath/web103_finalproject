import { useToast } from '../context/ToastContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

function ManageListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const toast = useToast()
  const tab = searchParams.get('tab') === 'venues' ? 'venues' : 'events'
  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      const results = await Promise.allSettled([
        fetch('/api/events/mine').then(async (res) => {
          if (!res.ok) throw new Error(`Unable to load events (HTTP ${res.status}).`)
          const data = await res.json()
          if (!Array.isArray(data)) throw new Error('Unexpected events response.')
          return data
        }),
        fetch('/api/venues/mine').then(async (res) => {
          if (!res.ok) throw new Error(`Unable to load venues (HTTP ${res.status}).`)
          const data = await res.json()
          if (!Array.isArray(data)) throw new Error('Unexpected venues response.')
          return data
        }),
      ])
      if (!active) return
      const nextErrors = {}
      if (results[0].status === 'fulfilled') setEvents(results[0].value)
      else nextErrors.events = results[0].reason.message
      if (results[1].status === 'fulfilled') setVenues(results[1].value)
      else nextErrors.venues = results[1].reason.message
      setErrors(nextErrors)
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [])

  async function remove(item) {
    const isVenue = tab === 'venues'
    const label = isVenue ? item.name : item.title
    const warning = isVenue
      ? 'Venues associated with events cannot be deleted.'
      : 'This event and its associated images and tags will be deleted.'
    if (!window.confirm(`Delete "${label}" (ID ${item.id})?\n\n${warning}\nThis cannot be undone.`)) return
    setDeleting(`${tab}:${item.id}`)
    setMessage('')
    setErrors((current) => ({ ...current, [tab]: '' }))
    try {
      const url = isVenue ? `/api/venues/${item.id}` : `/api/events/${item.id}`
      const response = await fetch(url, { method: 'DELETE' })
      if (!response.ok) {
        const details = await response.json().catch(() => ({}))
        throw new Error(details.error || `Deletion failed (HTTP ${response.status}).`)
      }
      if (isVenue) setVenues((current) => current.filter((v) => v.id !== item.id))
      else setEvents((current) => current.filter((e) => e.id !== item.id))
      setMessage(`Deleted "${label}".`)
      toast.success('Listing deleted successfully.')
    } catch (error) {
      setErrors((current) => ({ ...current, [tab]: error.message }))
      toast.error(error.message)
    } finally {
      setDeleting(null)
    }
  }

  const isVenue = tab === 'venues'
  const items = isVenue ? venues : events
  const kind = isVenue ? 'Venue' : 'Event'
  const activeError = errors[tab]

  return (
    <section className="manage-listings-page">
      <Link to="/" className="manage-back-link">&larr; Back to Events</Link>
      <header className="manage-listings-header">
        <div>
          <h1>Manage Listings</h1>
          <p className="muted">Manage your events and venues</p>
        </div>
        <span aria-hidden="true">&#9638;</span>
      </header>
      <div className="manage-listings-summary">
        <div className="manage-summary-card">My Events<strong className="manage-summary-number">{loading || errors.events ? '\u2014' : events.length}</strong></div>
        <div className="manage-summary-card">My Venues<strong className="manage-summary-number">{loading || errors.venues ? '\u2014' : venues.length}</strong></div>
      </div>
      <div className="manage-tabs" role="tablist" aria-label="Listing type">
        <button type="button" role="tab" className="manage-tab" aria-selected={!isVenue} onClick={() => setSearchParams({ tab: 'events' })}>Events</button>
        <button type="button" role="tab" className="manage-tab" aria-selected={isVenue} onClick={() => setSearchParams({ tab: 'venues' })}>Venues</button>
      </div>
      <div className="manage-section-head">
        <h2>My {isVenue ? 'Venues' : 'Events'}</h2>
        <Link className="manage-create" to={isVenue ? '/venues/new' : '/events/new'}>+ Create {kind}</Link>
      </div>
      {activeError && <p className="form-error" role="alert">{activeError}</p>}
      {message && <p className="manage-status" role="status">{message}</p>}
      {loading ? <LoadingSpinner label="Loading listings..." /> : !activeError && items.length === 0 ? (
        <p className="manage-status">You have not created any {isVenue ? 'venues' : 'events'} yet.</p>
      ) : (
        <ul className="manage-list">
          {items.map((item) => (
            <li className="manage-list-item" key={item.id}>
              <div>
                {isVenue ? <strong className="manage-item-title">{item.name}</strong> : <Link className="manage-item-title" to={`/events/${item.id}`}>{item.title}</Link>}
                <p className="muted">{isVenue ? item.city : [item.start_time ? new Date(item.start_time).toLocaleDateString() : '', item.city].filter(Boolean).join(' \u00B7 ')}</p>
              </div>
              <div className="manage-item-actions">
                <Link className="secondary-button" to={isVenue ? `/venues/${item.id}/edit` : `/events/${item.id}/edit`} aria-label={`Edit ${kind.toLowerCase()} ${isVenue ? item.name : item.title}`}>Edit</Link>
                <button type="button" className="secondary-button danger" disabled={deleting !== null} onClick={() => remove(item)} aria-label={`Delete ${kind.toLowerCase()} ${isVenue ? item.name : item.title}`}>
                  {deleting === `${tab}:${item.id}` ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ManageListingsPage