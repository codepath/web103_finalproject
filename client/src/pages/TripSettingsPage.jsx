import Spinner from '../components/Spinner.jsx'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import TripForm from '../components/TripForm.jsx'
import { useAsyncAction, useFeedback } from '../context/useFeedback.js'

export default function TripSettingsPage() {
  const { tripId } = useParams()
  const { activeUser } = useActiveUser()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')
  const { busy, pending: deleting, run } = useAsyncAction()
  const { notify } = useFeedback()

  useEffect(() => {
    setTrip(null)
    setError('')
    api(`/trips/${tripId}`).then(setTrip).catch((err) => setError(err.message))
  }, [tripId, activeUser.id])

  async function save(values) {
    await api(`/trips/${tripId}`, { method: 'PATCH', body: values })
    setTrip((previous) => ({ ...previous, ...values }))
    notify('Trip updated.')
  }

  async function remove() {
    if (busy) return
    if (!window.confirm(`Delete "${trip.title}" and everything in it? This cannot be undone.`)) return
    return run(async () => {
      setError('')
      try {
        await api(`/trips/${tripId}`, { method: 'DELETE' })
        notify('Trip deleted.')
        navigate('/trips')
      } catch (err) {
        setError(err.message)
      }
    })
  }

  if (error && !trip) return <p className="error" role="alert">{error}</p>
  if (!trip) return <Spinner label="Loading settings…" />
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
      {error && <p className="error" role="alert">{error}</p>}
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
      <h2>Delete trip</h2>
      <p className="page-note">Removes the trip, its activities, votes, and expenses.</p>
      <button className="btn btn-danger" disabled={busy} onClick={remove}>
        {deleting && <Spinner inline />}{deleting ? 'Deleting…' : 'Delete trip'}
      </button>
    </section>
  )
}
