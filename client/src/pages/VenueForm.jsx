import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

const EMPTY = {
  name: '',
  address: '',
  city: '',
  latitude: '',
  longitude: '',
  website_url: '',
  hours: '',
}

// Create (/venues/new) and edit (/venues/:id/edit) share this form
function VenueForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState(isEdit ? null : EMPTY)
  const [loadError, setLoadError] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    let stale = false
    fetch(`/api/venues/${id}`)
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject(
              new Error(
                res.status === 404
                  ? 'Venue not found'
                  : `Request failed (${res.status})`,
              ),
            ),
      )
      .then((venue) => {
        if (stale) return
        if (venue.owner_id !== user.id) {
          setLoadError('You can only edit venues you own')
          return
        }
        // Inputs need strings, not null
        setForm(
          Object.fromEntries(
            Object.keys(EMPTY).map((key) => [key, venue[key] ?? '']),
          ),
        )
      })
      .catch((err) => {
        if (!stale) setLoadError(err.message)
      })
    return () => {
      stale = true
    }
  }, [id, isEdit, user.id])

  const set = (field) => (e) =>
    setForm((current) => ({ ...current, [field]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(isEdit ? `/api/venues/${id}` : '/api/venues', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Save failed (${res.status})`)
      }
      navigate('/venues')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loadError)
    return (
      <p className="status">
        {loadError}. <Link to="/venues">Back to my venues</Link>
      </p>
    )
  if (!form) return <p className="status">Loading venue…</p>

  return (
    <form className="event-form" onSubmit={submit}>
      <Link to="/venues" className="back">
        Back to my venues
      </Link>
      <h1>{isEdit ? 'Edit venue' : 'Add a venue'}</h1>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <label>
        Venue name
        <input
          required
          maxLength={120}
          value={form.name}
          onChange={set('name')}
        />
      </label>
      <div className="form-row">
        <label>
          Street address
          <input
            required
            maxLength={200}
            value={form.address}
            onChange={set('address')}
          />
        </label>
        <label>
          City
          <input
            required
            maxLength={100}
            value={form.city}
            onChange={set('city')}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Latitude (optional)
          <input
            type="number"
            step="any"
            min={-90}
            max={90}
            value={form.latitude}
            onChange={set('latitude')}
          />
        </label>
        <label>
          Longitude (optional)
          <input
            type="number"
            step="any"
            min={-180}
            max={180}
            value={form.longitude}
            onChange={set('longitude')}
          />
        </label>
      </div>
      <p className="muted">
        Coordinates let visitors see how far away the venue is.
      </p>
      <label>
        Website (optional)
        <input
          type="url"
          placeholder="https://"
          value={form.website_url}
          onChange={set('website_url')}
        />
      </label>
      <label>
        Hours (optional)
        <input
          maxLength={200}
          placeholder="Tue–Sun 10am–8pm"
          value={form.hours}
          onChange={set('hours')}
        />
      </label>

      <button type="submit" className="button" disabled={saving}>
        {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add venue'}
      </button>
    </form>
  )
}

export default VenueForm
