import ActivityCard from './ActivityCard.jsx'

export default function ActivityList({ activities, trip, onChanged }) {
  if (activities.length === 0) {
    return <p className="page-note">No activities yet. Add the first one.</p>
  }
  return (
    <div className="stack">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} trip={trip} onChanged={onChanged} />
      ))}
    </div>
  )
}
