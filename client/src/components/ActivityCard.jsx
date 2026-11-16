import { useState } from 'react'
import { api, formatDate, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import { useAsyncAction, useFeedback } from '../context/useFeedback.js'
import Spinner from './Spinner.jsx'
import Icon from './Icon.jsx'

export default function ActivityCard({ activity, onChanged, onEdit }) {
  const { activeUser } = useActiveUser()
  const [error, setError] = useState('')
  const [action, setAction] = useState('')
  const { busy, pending, run } = useAsyncAction()
  const { notify } = useFeedback()
  const mine = activity.created_by_id === activeUser.id

  async function toggleVote() {
    return run(async () => {
      setAction('vote')
      setError('')
      try {
        await api(`/activities/${activity.id}/votes`, { method: activity.user_voted ? 'DELETE' : 'POST' })
        notify(activity.user_voted ? 'Vote removed.' : 'Vote added.')
        await onChanged()
      } catch (err) {
        setError(err.message)
      }
    })
  }

  async function remove() {
    if (busy) return
    if (!window.confirm(`Delete "${activity.title}"?`)) return
    return run(async () => {
      setAction('delete')
      setError('')
      try {
        await api(`/activities/${activity.id}`, { method: 'DELETE' })
        notify('Activity deleted.')
        await onChanged()
      } catch (err) {
        setError(err.message)
      }
    })
  }

  return (
    <article className="card activity-card">
      <div className="trip-card-head">
        <div className="activity-heading"><span className="activity-marker"><Icon name="pin" /></span><div><h3>{activity.title}</h3>{activity.location && <p className="activity-location">{activity.location}</p>}</div></div>
        <span className="activity-cost">{formatMoney(activity.estimated_cost)}<small>estimated</small></span>
      </div>
      {activity.description && <p className="page-note">{activity.description}</p>}
      <p className="page-note activity-meta">
        <Icon name="calendar" />
        {activity.scheduled_date ? formatDate(activity.scheduled_date) : 'Not scheduled'} · added by{' '}
        {activity.created_by_name}
      </p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="inline-row">
        <button
          className={`btn btn-small${activity.user_voted ? ' btn-voted' : ''}`}
          onClick={toggleVote}
          disabled={busy}
          aria-busy={pending && action === 'vote'}
          aria-pressed={activity.user_voted}
        >
          {pending && action === 'vote' ? <Spinner inline /> : <Icon name="heart" />}
          {pending && action === 'vote' ? 'Updating…' : activity.user_voted ? 'Remove vote' : 'Vote'}
        </button>
        <span className="vote-count" aria-label={`${activity.vote_count} votes`}>
          {activity.vote_count} {activity.vote_count === 1 ? 'vote' : 'votes'}
        </span>
        {mine && (
          <>
            <button className="btn btn-small" disabled={busy} onClick={() => onEdit(activity)}>Edit</button>
            <button className="btn btn-small btn-danger" disabled={busy} onClick={remove}>
              {pending && action === 'delete' && <Spinner inline />}{pending && action === 'delete' ? 'Deleting…' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </article>
  )
}
