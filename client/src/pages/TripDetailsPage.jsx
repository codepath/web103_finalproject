import Spinner from '../components/Spinner.jsx'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, formatDate, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import MemberList from '../components/MemberList.jsx'
import ActivityList from '../components/ActivityList.jsx'
import ActivityForm from '../components/ActivityForm.jsx'
import SlideOver from '../components/SlideOver.jsx'
import { useFeedback } from '../context/useFeedback.js'

export default function TripDetailsPage() {
  const { tripId } = useParams()
  const { activeUser } = useActiveUser()
  const { busy, notify } = useFeedback()
  const [trip, setTrip] = useState(null)
  const [members, setMembers] = useState([])
  const [activities, setActivities] = useState([])
  // null when closed, otherwise { activity } where activity is null for a new one.
  const [panel, setPanel] = useState(null)
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

  async function saveActivity(values) {
    const editing = Boolean(panel.activity)
    if (panel.activity) {
      await api(`/activities/${panel.activity.id}`, { method: 'PATCH', body: values })
    } else {
      await api(`/trips/${tripId}/activities`, { method: 'POST', body: values })
    }
    notify(editing ? 'Activity updated.' : 'Activity added.')
    setPanel(null)
    await loadActivities()
  }

  if (error && !trip) return <p className="error" role="alert">{error}</p>
  if (!trip) return <Spinner label="Loading trip…" />

  return (
    <section>
      <h1>{trip.title}</h1>
      {error && <p className="error" role="alert">{error}</p>}
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
        <button className="btn" disabled={busy || Boolean(panel)} onClick={() => setPanel({ activity: null })}>Add activity</button>
      </div>
      <ActivityList
        activities={activities}
        trip={trip}
        onChanged={loadActivities}
        onEdit={(activity) => setPanel({ activity })}
      />
      {panel && (
        <SlideOver title={panel.activity ? 'Edit activity' : 'Add activity'} onClose={() => setPanel(null)}>
          <ActivityForm
            trip={trip}
            initial={
              panel.activity && {
                title: panel.activity.title,
                location: panel.activity.location || '',
                scheduled_date: panel.activity.scheduled_date || '',
                description: panel.activity.description || '',
                estimated_cost: panel.activity.estimated_cost,
              }
            }
            submitLabel={panel.activity ? 'Save activity' : 'Add activity'}
            onSubmit={saveActivity}
            onCancel={() => setPanel(null)}
          />
        </SlideOver>
      )}
    </section>
  )
}
