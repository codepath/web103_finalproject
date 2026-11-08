import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, formatDate, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import MemberList from '../components/MemberList.jsx'
import ActivityList from '../components/ActivityList.jsx'
import ActivityForm from '../components/ActivityForm.jsx'

export default function TripDetailsPage() {
  const { tripId } = useParams()
  const { activeUser } = useActiveUser()
  const [trip, setTrip] = useState(null)
  const [members, setMembers] = useState([])
  const [activities, setActivities] = useState([])
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const loadActivities = useCallback(
    () => api(`/trips/${tripId}/activities`).then(setActivities).catch((err) => setError(err.message)),
    [tripId],
  )

  useEffect(() => {
    setTrip(null)
    setError('')
    Promise.all([api(`/trips/${tripId}`), api(`/trips/${tripId}/members`), api(`/trips/${tripId}/activities`)])
      .then(([tripData, memberData, activityData]) => {
        setTrip(tripData)
        setMembers(memberData)
        setActivities(activityData)
      })
      .catch((err) => setError(err.message))
  }, [tripId, activeUser.id])

  async function addActivity(values) {
    await api(`/trips/${tripId}/activities`, { method: 'POST', body: values })
    setAdding(false)
    await loadActivities()
  }

  if (error) return <p className="error" role="alert">{error}</p>
  if (!trip) return <p className="page-note">Loading trip…</p>

  return (
    <section>
      <h1>{trip.title}</h1>
      <p className="page-note">
        {trip.destination} · {formatDate(trip.start_date)} – {formatDate(trip.end_date)} ·{' '}
        {formatMoney(trip.budget)} budget
      </p>
      <p>
        Invite code: <code className="code">{trip.invite_code}</code>
      </p>

      <h2>Members ({members.length})</h2>
      <MemberList members={members} />

      <div className="page-head section-head">
        <h2>Activities</h2>
        {!adding && <button className="btn" onClick={() => setAdding(true)}>Add activity</button>}
      </div>
      {adding && (
        <div className="stack">
          <ActivityForm trip={trip} submitLabel="Add activity" onSubmit={addActivity} onCancel={() => setAdding(false)} />
        </div>
      )}
      <ActivityList activities={activities} trip={trip} onChanged={loadActivities} />
    </section>
  )
}
