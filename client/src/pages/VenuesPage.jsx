import { useToast } from '../context/ToastContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

function VenuesPage() {
  const { user } = useAuth()
  const toast = useToast()
  const [venues, setVenues] = useState([])
  const myVenues = venues
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let active = true

    async function loadVenues() {
      try {
        const response = await fetch('/api/venues/mine')

        if (!response.ok) {
          throw new Error(`Unable to load venues (HTTP ${response.status}).`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Unexpected venue response.')
        }

        if (active) setVenues(data)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadVenues()

    return () => {
      active = false
    }
  }, [])

  async function deleteVenue(venue) {
    const confirmed = window.confirm(
      `Delete "${venue.name}" (ID ${venue.id})?\n\n` +
        'This action cannot be undone. Venues with associated events cannot be deleted.',
    )

    if (!confirmed) return

    setDeletingId(venue.id)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/venues/${venue.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        let details = {}

        try {
          details = await response.json()
        } catch {
          // Some server errors have no JSON body.
        }

        if (response.status === 409) {
          throw new Error(
            details.error ||
              'This venue cannot be deleted because it is referenced by events.',
          )
        }

        throw new Error(
          details.error || `Venue deletion failed (HTTP ${response.status}).`,
        )
      }

      setVenues((current) => current.filter((item) => item.id !== venue.id))
      setMessage(`Deleted "${venue.name}" (ID ${venue.id}).`)
      toast.success('Venue deleted successfully.')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="venues-page">
      <Link to="/" className="back">
        Back to homepage
      </Link>

      <h1>Manage Venues</h1>
      <Link to="/venues/new" className="secondary-button">
        Create Venue
      </Link>
      <p className="muted">
        View and manage venues you created. Venues associated with events cannot be deleted.
      </p>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}

      {loading ? (
        <LoadingSpinner label="Loading venues..." />
      ) : myVenues.length === 0 ? (
        <p>You have not created any venues yet.</p>
      ) : (
        <ul className="venue-list">
          {myVenues.map((venue) => (
            <li className="venue-item" key={venue.id}>
              <div>
                <strong>{venue.name}</strong>
                <p className="muted">
                  {venue.city} &middot; Venue ID {venue.id}
                </p>
              </div>

              <Link
                to={`/venues/${venue.id}/edit`}
                className="secondary-button"
                aria-label={`Edit ${venue.name}, venue ID ${venue.id}`}
              >
                Edit
              </Link>
              {user?.id === venue.owner_id && (
                <button
                  type="button"
                  className="secondary-button danger"
                  disabled={deletingId !== null}
                  onClick={() => deleteVenue(venue)}
                  aria-label={`Delete ${venue.name}, venue ID ${venue.id}`}
                >
                  {deletingId === venue.id ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default VenuesPage
