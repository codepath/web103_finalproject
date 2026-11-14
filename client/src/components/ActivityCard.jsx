import { useState } from 'react'
import { api, formatDate, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import ActivityForm from './ActivityForm.jsx'

export default function ActivityCard({ activity, trip, onChanged }) {
  const { activeUser } = useActiveUser()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const mine = activity.created_by_id === activeUser.id

  async function save(values) {
    await api(`/activities/${activity.id}`, { method: 'PATCH', body: values })
    setEditing(false)
    onChanged()
  }

  async function toggleVote() {
    setError('')
    try {
      await api(`/activities/${activity.id}/votes`, { method: activity.user_voted ? 'DELETE' : 'POST' })
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${activity.title}"?`)) return
    try {
      await api(`/activities/${activity.id}`, { method: 'DELETE' })
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  if (editing) {
    return (
      <ActivityForm
        trip={trip}
        initial={{
          title: activity.title,
          location: activity.location || '',
          scheduled_date: activity.scheduled_date || '',
          description: activity.description || '',
          estimated_cost: activity.estimated_cost,
        }}
        submitLabel="Save activity"
        onSubmit={save}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <article className="card activity-card">
      <div className="trip-card-head">
        <h3>{activity.title}</h3>
        <span className="page-note">{formatMoney(activity.estimated_cost)}</span>
      </div>
      {activity.location && <p>{activity.location}</p>}
      {activity.description && <p className="page-note">{activity.description}</p>}
      <p className="page-note">
        {activity.scheduled_date ? formatDate(activity.scheduled_date) : 'Not scheduled'} · added by{' '}
        {activity.created_by_name}
      </p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="inline-row">
        <button
          className={`btn btn-small${activity.user_voted ? ' btn-voted' : ''}`}
          onClick={toggleVote}
          aria-pressed={activity.user_voted}
        >
          {activity.user_voted ? 'Remove vote' : 'Vote'}
        </button>
        <span className="vote-count" aria-label={`${activity.vote_count} votes`}>
          {activity.vote_count} {activity.vote_count === 1 ? 'vote' : 'votes'}
        </span>
        {mine && (
          <>
            <button className="btn btn-small" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn btn-small btn-danger" onClick={remove}>Delete</button>
          </>
        )}
      </div>
    </article>
  )
}
