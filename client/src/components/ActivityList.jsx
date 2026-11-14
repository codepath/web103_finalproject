import { useState } from 'react'
import { formatDate } from '../api.js'
import ActivityCard from './ActivityCard.jsx'

// Every day from start to end (inclusive) as "YYYY-MM-DD" strings.
function tripDays(trip) {
  const days = []
  const [y, m, d] = trip.start_date.split('-').map(Number)
  const cursor = new Date(Date.UTC(y, m - 1, d))
  while (cursor.toISOString().slice(0, 10) <= trip.end_date && days.length < 366) {
    days.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return days
}

export default function ActivityList({ activities, trip, onChanged }) {
  const [filter, setFilter] = useState('all')

  if (activities.length === 0) {
    return <p className="page-note">No activities yet. Add the first one.</p>
  }

  const days = tripDays(trip)
  const groups = days
    .map((day) => ({ key: day, label: formatDate(day), items: activities.filter((a) => a.scheduled_date === day) }))
    .filter((group) => group.items.length > 0)
  const unscheduled = activities.filter((a) => !a.scheduled_date)
  if (unscheduled.length > 0) groups.push({ key: 'unscheduled', label: 'Not scheduled yet', items: unscheduled })

  const visible = filter === 'all' ? groups : groups.filter((group) => group.key === filter)

  return (
    <div className="stack">
      <label className="filter">
        Show
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All days</option>
          {days.map((day) => (
            <option key={day} value={day}>{formatDate(day)}</option>
          ))}
          <option value="unscheduled">Not scheduled yet</option>
        </select>
      </label>
      {visible.length === 0 && <p className="page-note">Nothing planned for this day yet.</p>}
      {visible.map((group) => (
        <div key={group.key} className="day-group">
          <h3 className="day-heading">{group.label}</h3>
          <div className="stack">
            {group.items.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} trip={trip} onChanged={onChanged} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
