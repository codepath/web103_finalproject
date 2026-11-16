import { useState } from 'react'
import { formatDate } from '../api.js'
import ActivityCard from './ActivityCard.jsx'
import Icon from './Icon.jsx'

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

export default function ActivityList({ activities, trip, onChanged, onEdit }) {
  const [filter, setFilter] = useState('all')

  if (activities.length === 0) {
    return <div className="empty-state"><Icon name="map" /><h3>A blank page, a world of possibilities.</h3><p>No activities yet. Add a place you want to go or something you want to do.</p></div>
  }

  const days = tripDays(trip)
  const groups = days
    .map((day) => ({ key: day, label: formatDate(day), items: activities.filter((a) => a.scheduled_date === day) }))
    .filter((group) => group.items.length > 0)
  const unscheduled = activities.filter((a) => !a.scheduled_date)
  if (unscheduled.length > 0) groups.push({ key: 'unscheduled', label: 'Not scheduled yet', items: unscheduled })

  const visible = filter === 'all' ? groups : groups.filter((group) => group.key === filter)

  return (
    <div className="stack itinerary-list">
      <label className="filter">
        <Icon name="calendar" />View itinerary
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
          <div className="day-label"><span className="day-number">{group.key === 'unscheduled' ? '…' : String(days.indexOf(group.key) + 1).padStart(2, '0')}</span><h3 className="day-heading">{group.label}</h3>{group.key !== 'unscheduled' && <span className="day-caption">DAY {days.indexOf(group.key) + 1}</span>}</div>
          <div className="stack day-activities">
            {group.items.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} onChanged={onChanged} onEdit={onEdit} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
