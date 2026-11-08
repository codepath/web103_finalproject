import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import TripForm from '../components/TripForm.jsx'

export default function TripSettingsPage() {
  const { tripId } = useParams()
  const { activeUser } = useActiveUser()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setTrip(null)
    setError('')
    api(`/trips/${tripId}`).then(setTrip).catch((err) => setError(err.message))
  }, [tripId, activeUser.id])

  async function save(values) {
    await api(`/trips/${tripId}`, { method: 'PATCH', body: values })
    setSaved(true)
  }

  async function remove() {
    if (!window.confirm(`Delete "${trip.title}" and everything in it? This cannot be undone.`)) return
    try {
      await api(`/trips/${tripId}`, { method: 'DELETE' })
      navigate('/trips')
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) return <p className="error" role="alert">{error}</p>
  if (!trip) return <p className="page-note">Loading settings…</p>
  if (trip.role !== 'organizer') {
    return (
      <section>
        <h1>Settings</h1>
        <p className="page-note">Only the trip organizer can change trip settings.</p>
      </section>
    )
  }

  return (
    <section>
      <h1>Settings</h1>
      <TripForm
        initial={{
          title: trip.title,
          destination: trip.destination,
          start_date: trip.start_date,
          end_date: trip.end_date,
          budget: trip.budget,
        }}
        submitLabel="Save changes"
        onSubmit={save}
      />
      {saved && <p role="status">Trip updated.</p>}
      <h2>Delete trip</h2>
      <p className="page-note">Removes the trip, its activities, votes, and expenses.</p>
      <button className="btn btn-danger" onClick={remove}>Delete trip</button>
    </section>
  )
}
