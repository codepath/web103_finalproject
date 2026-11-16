import { useToast } from '../context/ToastContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VenueFields from '../components/VenueFields.jsx'
import { parseVenueAddress, toVenuePayload } from '../utils/venueAddress.js'

const emptyVenue = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  website_url: '',
  latitude: '',
  longitude: '',
}

function VenueForm() {
  const { id } = useParams()
  const isEdit = id !== undefined
  const navigate = useNavigate()
  const toast = useToast()

  const [venue, setVenue] = useState(emptyVenue)
  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)
  const submissionLock = useRef(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoStatus, setGeoStatus] = useState('')

  useEffect(() => {
    if (!isEdit) return

    const controller = new AbortController()

    async function loadVenue() {
      try {
        const response = await fetch(`/api/venues/${id}`, {
          signal: controller.signal,
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load venue.')
        }

        const address = parseVenueAddress(data.address)
        if (!address) {
          throw new Error(
            'This venue uses an address format that cannot be safely edited here. No changes have been made.',
          )
        }

        if (controller.signal.aborted) return

        setVenue({
          name: data.name ?? '',
          ...address,
          city: data.city ?? '',
          website_url: data.website_url ?? '',
          latitude: data.latitude == null ? '' : String(data.latitude),
          longitude: data.longitude == null ? '' : String(data.longitude),
        })
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(error.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadVenue()
    return () => controller.abort()
  }, [id, isEdit])

  const updateVenue = (field) => (event) => {
    const value = event.target.value

    setVenue((current) => ({
      ...current,
      [field]: value,
      ...(['address', 'city', 'state', 'zip_code'].includes(field)
        ? { latitude: '', longitude: '' }
        : {}),
    }))

    if (['address', 'city', 'state', 'zip_code'].includes(field)) {
      setGeoStatus('')
    }
  }

  const findCoordinates = async () => {
    setGeoLoading(true)
    setGeoStatus('')

    try {
      const params = new URLSearchParams({
        address: venue.address,
        city: venue.city,
        state: venue.state,
        zip_code: venue.zip_code,
      })

      const response = await fetch(`/api/geocode?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to find coordinates.')
      }

      setVenue((current) => ({
        ...current,
        latitude: String(data.latitude),
        longitude: String(data.longitude),
      }))
      setGeoStatus('Coordinates found. You can edit them.')
    } catch (error) {
      setGeoStatus(error.message)
    } finally {
      setGeoLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submissionLock.current) return
    submissionLock.current = true
    setSaving(true)
    setSubmitError('')

    try {
      const response = await fetch(
        isEdit ? `/api/venues/${id}` : '/api/venues',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toVenuePayload(venue)),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`)
      }

      toast.success(isEdit ? 'Venue updated successfully.' : 'Venue created successfully.')
      navigate('/venues')
    } catch (error) {
      setSubmitError(error.message)
      toast.error(error.message)
    } finally {
      submissionLock.current = false
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading venue..." />

  if (loadError) {
    return (
      <p className="status" role="alert">
        {loadError} <Link to="/venues">Back to Manage Venues</Link>
      </p>
    )
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <Link to="/venues" className="back">
        Back to Manage Venues
      </Link>

      <h1>{isEdit ? 'Edit venue' : 'Create venue'}</h1>

      <fieldset className="submission-fieldset" disabled={saving}>
      <VenueFields
        newVenue={venue}
        updateVenue={updateVenue}
        findCoordinates={findCoordinates}
        geoLoading={geoLoading}
        geoStatus={geoStatus}
      />

      {submitError && (
        <p className="form-error" role="alert">
          {submitError}
        </p>
      )}

      <button type="submit" className="button" disabled={saving}>
        {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create venue'}
      </button>
      </fieldset>
    </form>
  )
}

export default VenueForm