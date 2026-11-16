import Spinner from '../components/Spinner.jsx'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatDate, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import MemberList from '../components/MemberList.jsx'
import ActivityList from '../components/ActivityList.jsx'
import ActivityForm from '../components/ActivityForm.jsx'
import SlideOver from '../components/SlideOver.jsx'
import { useFeedback } from '../context/useFeedback.js'
import Icon from '../components/Icon.jsx'
import { tripLength, tripStatus } from '../travel.js'

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
    <section className="trip-details-page">
      <Link to="/trips" className="back-link"><Icon name="back" />Back to all trips</Link>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="trip-hero">
        <img src="/images/journey-landscape.jpg" alt="" className="trip-hero-image" width="1536" height="1024" />
        <div className="trip-hero-content"><span className="trip-status">{tripStatus(trip)}</span><h1>{trip.title}</h1><p><Icon name="pin" />{trip.destination}<span className="hero-dot">·</span>{tripLength(trip)} days, countless possibilities</p></div>
      </div>
      <div className="trip-facts">
        <div><Icon name="calendar" /><span><small>THE DATES</small><strong>{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</strong></span></div>
        <div><Icon name="wallet" /><span><small>THE BUDGET</small><strong>{formatMoney(trip.budget)}<small className="fact-unit"> for the trip</small></strong></span></div>
        <div><Icon name="people" /><span><small>THE COMPANY</small><strong>{members.length} {members.length === 1 ? 'traveler' : 'travelers'}<small className="fact-unit"> and counting</small></strong></span></div>
      </div>
      <div className="trip-layout">
        <div className="itinerary-column">
          <div className="page-head section-head"><div><span className="eyebrow">MAKE ROOM FOR ADVENTURE</span><h2>The itinerary</h2><p className="page-note">Big plans and small detours, all in one place.</p></div><button className="btn btn-primary" disabled={busy || Boolean(panel)} onClick={() => setPanel({ activity: null })}><Icon name="plus" />Add activity</button></div>
          <ActivityList activities={activities} trip={trip} onChanged={loadActivities} onEdit={(activity) => setPanel({ activity })} />
        </div>
        <aside className="trip-aside" aria-label="Trip members and invitation">
          <div className="card invite-card"><span className="aside-icon"><Icon name="ticket" /></span><h2>Better with friends.</h2><p className="page-note">Share this invite code and bring your favorite people along.</p><span className="eyebrow">INVITE CODE</span><code className="code invite-code">{trip.invite_code}</code></div>
          <div className="card people-card"><div className="aside-title"><h2>The travel crew</h2><span className="badge">{members.length}</span></div><MemberList members={members} /></div>
          <div className="travel-tip"><Icon name="leaf" /><p>Leave a little room<br />for the <em>unexpected.</em></p></div>
        </aside>
      </div>
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
