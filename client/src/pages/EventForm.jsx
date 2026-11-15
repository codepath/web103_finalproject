import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TagPicker from '../components/TagPicker.jsx'

const getJson = (url) =>
  fetch(url).then((res) =>
    res.ok
      ? res.json()
      : Promise.reject(new Error(`Request failed (${res.status})`)),
  )

const US_STATES = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
  ['DC', 'Washington, DC'],
]
const emptyEvent = {
  title: '',
  venue_id: '',
  activity_type_id: '',
  start_time: '',
  end_time: '',
  price: '0',
  description: '',
  what_to_bring: '',
  image_url: '',
  tag_ids: [],
}

// API timestamp -> "YYYY-MM-DDTHH:mm" in the browser's local time, the format datetime-local needs
// ponytail: assumes browser and server share a timezone (true in dev); store timestamptz if deployed users span zones
const toInputTime = (ts) => {
  const d = new Date(ts)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// API event -> form state; the API returns tag names, the form tracks tag ids
const toForm = (event, tags) => ({
  title: event.title,
  venue_id: String(event.venue_id),
  activity_type_id: String(event.activity_type_id),
  start_time: toInputTime(event.start_time),
  end_time: toInputTime(event.end_time),
  price: String(Number(event.price)),
  description: event.description ?? '',
  what_to_bring: event.what_to_bring ?? '',
  image_url: event.images?.[0] ?? '',
  tag_ids: tags.filter((t) => event.tags.includes(t.name)).map((t) => t.id),
})

// Used for both /events/new (create) and /events/:id/edit (edit)
function EventForm() {
  const { id } = useParams()
  const isEdit = id !== undefined
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyEvent)
  const [options, setOptions] = useState(null) // { venues, activityTypes, tags }
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getJson('/api/venues'),
      getJson('/api/activity-types'),
      getJson('/api/tags'),
      isEdit ? getJson(`/api/events/${id}`) : null,
    ])
      .then(([venues, activityTypes, tags, event]) => {
        if (event) setForm(toForm(event, tags))
        setOptions({ venues, activityTypes, tags })
      })
      .catch((err) => setLoadError(err.message))
  }, [id, isEdit])

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value })
  const toggleTag = (id) =>
    setForm({
      ...form,
      tag_ids: form.tag_ids.includes(id)
        ? form.tag_ids.filter((t) => t !== id)
        : [...form.tag_ids, id],
    })

  const [venueMode, setVenueMode] = useState('existing')

  const [newVenue, setNewVenue] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    website_url: '',
    latitude: '',
    longitude: '',
  })

  const [geoLoading, setGeoLoading] = useState(false)
  const [geoStatus, setGeoStatus] = useState('')

  const updateVenue = (field) => (event) => {
    const value = event.target.value

    setNewVenue((current) => ({
      ...current,
      [field]: value,
    }))

    if (['address', 'city', 'state', 'zip_code'].includes(field)) {
      setGeoStatus('')
      setNewVenue((current) => ({
        ...current,
        latitude: '',
        longitude: '',
      }))
    }
  }

  const findCoordinates = async () => {
    setGeoLoading(true)
    setGeoStatus('')

    try {
      const params = new URLSearchParams({
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        zip_code: newVenue.zip_code,
      })

      const response = await fetch(`/api/geocode?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to find coordinates.')
      }

      setNewVenue((current) => ({
        ...current,
        latitude: String(result.latitude),
        longitude: String(result.longitude),
      }))

      setGeoStatus('Coordinates found. You can edit them.')
    } catch (error) {
      setGeoStatus(error.message)
    } finally {
      setGeoLoading(false)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.end_time <= form.start_time)
      return setSubmitError('End time must be after start time.')

    setSaving(true)
    setSubmitError(null)
    try {
      // Selects and number inputs give strings; the API expects integers/numbers
      const res = await fetch(isEdit ? `/api/events/${id}` : '/api/events', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          venue_id: venueMode === 'new' ? null : Number(form.venue_id),
          ...(venueMode === 'new'
            ? {
                new_venue: {
                  name: newVenue.name.trim(),
                  address: newVenue.address.trim(),
                  city: newVenue.city.trim(),
                  state: newVenue.state,
                  zip_code: newVenue.zip_code.trim(),
                  website_url: newVenue.website_url.trim() || null,
                  latitude:
                    newVenue.latitude === '' ? null : Number(newVenue.latitude),
                  longitude:
                    newVenue.longitude === ''
                      ? null
                      : Number(newVenue.longitude),
                },
              }
            : {}),
          activity_type_id: Number(form.activity_type_id),
          price: Number(form.price),
        }),
      })
      const body = await res.json()
      if (!res.ok)
        throw new Error(body.error || `Request failed (${res.status})`)
      navigate(`/events/${body.id}`)
    } catch (err) {
      setSubmitError(err.message)
      setSaving(false)
    }
  }

  if (loadError)
    return (
      <p className="status">
        Couldn't load the form: {loadError}. <Link to="/">Back to events</Link>
      </p>
    )
  if (!options) return <p className="status">Loading form…</p>

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      {isEdit ? (
        <Link to={`/events/${id}`} className="back">
          ← Back to event
        </Link>
      ) : (
        <Link to="/" className="back">
          ← All events
        </Link>
      )}
      <h1>{isEdit ? 'Edit event' : 'Post a new event'}</h1>

      <div className="form-row">
        <label>
          Title
          <input required value={form.title} onChange={set('title')} />
        </label>
        <label>
          Activity type
          <select
            required
            value={form.activity_type_id}
            onChange={set('activity_type_id')}
          >
            <option value="" disabled>
              Choose a type
            </option>
            {options.activityTypes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="venue-section">
        <div>
          <fieldset>
            <legend>Venue</legend>
            <label>
              <input
                type="radio"
                name="venueMode"
                checked={venueMode === 'existing'}
                onChange={() => setVenueMode('existing')}
              />
              Select an existing venue
            </label>
            <label>
              <input
                type="radio"
                name="venueMode"
                checked={venueMode === 'new'}
                onChange={() => setVenueMode('new')}
              />
              Add a new venue
            </label>
            {venueMode === 'existing' ? (
              <label>
                <div className="venue-management-link">
                  <Link to="/venues">Manage venues</Link>
                </div>
                Venue
                <select
                  required
                  value={form.venue_id}
                  onChange={set('venue_id')}
                >
                  <option value="" disabled>
                    Choose a venue
                  </option>
                  {options.venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city})
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div>
                <label>
                  Venue name
                  <input
                    required
                    value={newVenue.name}
                    onChange={updateVenue('name')}
                  />
                </label>
                <label>
                  Street address
                  <input
                    required
                    value={newVenue.address}
                    onChange={updateVenue('address')}
                  />
                </label>
                <label>
                  City
                  <input
                    required
                    value={newVenue.city}
                    onChange={updateVenue('city')}
                  />
                </label>
                <label>
                  State
                  <select
                    required
                    value={newVenue.state}
                    onChange={updateVenue('state')}
                  >
                    <option value="" disabled>
                      Choose a state
                    </option>
                    {US_STATES.map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  ZIP code (optional)
                  <input
                    value={newVenue.zip_code}
                    onChange={updateVenue('zip_code')}
                    inputMode="numeric"
                    pattern="[0-9]{5}(-[0-9]{4})?"
                    placeholder="33312"
                  />
                </label>
                <label>
                  Website (optional)
                  <input
                    type="url"
                    value={newVenue.website_url}
                    onChange={updateVenue('website_url')}
                  />
                </label>
                <button
                  type="button"
                  onClick={findCoordinates}
                  disabled={
                    geoLoading ||
                    !newVenue.address.trim() ||
                    !newVenue.city.trim() ||
                    !newVenue.state
                  }
                >
                  {geoLoading ? 'Finding coordinates...' : 'Find coordinates'}
                </button>
                {geoStatus && <p role="status">{geoStatus}</p>}
                <label>
                  Latitude
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    value={newVenue.latitude}
                    onChange={updateVenue('latitude')}
                  />
                </label>
                <label>
                  Longitude
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    value={newVenue.longitude}
                    onChange={updateVenue('longitude')}
                  />
                </label>
              </div>
            )}
          </fieldset>
        </div>
      </section>

      <div className="form-row">
        <label>
          Starts
          <input
            type="datetime-local"
            required
            value={form.start_time}
            onChange={set('start_time')}
          />
        </label>
        <label>
          Ends
          <input
            type="datetime-local"
            required
            min={form.start_time}
            value={form.end_time}
            onChange={set('end_time')}
          />
        </label>
        <label>
          Price ($)
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={set('price')}
          />
        </label>
      </div>

      <label>
        Description
        <textarea
          rows="4"
          value={form.description}
          onChange={set('description')}
        />
      </label>
      <label>
        Picture URL (optional)
        <input
          type="url"
          placeholder="https://example.com/event-photo.jpg"
          value={form.image_url}
          onChange={set('image_url')}
        />
      </label>
      {form.image_url.trim() && (
        <div className="event-image-preview">
          <img
            src={form.image_url.trim()}
            alt="Event picture preview"
            style={{
              maxWidth: '100%',
              maxHeight: '250px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
      )}

      <label>
        What to bring
        <input value={form.what_to_bring} onChange={set('what_to_bring')} />
      </label>

      <TagPicker
        tags={options.tags}
        selected={form.tag_ids}
        onToggle={toggleTag}
      />

      {submitError && (
        <p className="form-error" role="alert">
          {submitError}
        </p>
      )}
      <button type="submit" className="button" disabled={saving}>
        {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Post event'}
      </button>
    </form>
  )
}

export default EventForm
