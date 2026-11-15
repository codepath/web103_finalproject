import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatShortDate } from '../format.js'

// Container + view for /profile (wrapped in RequireAuth in App.jsx)
function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/profile')
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject(new Error(`Request failed (${res.status})`)),
      )
      .then(setProfile)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <p className="status">Couldn't load profile: {error}</p>
  if (!profile) return <p className="status">Loading profile…</p>

  return (
    <article className="event-page profile-page">
      <Link to="/" className="back">
        ← All events
      </Link>

      <div className="profile-head">
        {profile.avatar_url && (
          <img className="profile-avatar" src={profile.avatar_url} alt="" />
        )}
        <div>
          <h1>{profile.name}</h1>
          {profile.username && <p className="muted">@{profile.username}</p>}
        </div>
      </div>

      <dl className="details">
        <dt>Bio</dt>
        <dd>{profile.bio || 'No bio yet.'}</dd>
        <dt>City</dt>
        <dd>{profile.city || '—'}</dd>
        <dt>Website</dt>
        <dd>
          {profile.website_url ? (
            <a href={profile.website_url} target="_blank" rel="noreferrer">
              {profile.website_url}
            </a>
          ) : (
            '—'
          )}
        </dd>
        <dt>Member since</dt>
        <dd>{formatShortDate(profile.created_at)}</dd>
      </dl>

      <h2>My events ({profile.events.length})</h2>
      {profile.events.length ? (
        <ul className="profile-events">
          {profile.events.map((event) => (
            <li key={event.id}>
              <Link to={`/events/${event.id}`}>{event.title}</Link>{' '}
              <span className="muted">{formatShortDate(event.start_time)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          You haven't posted any events yet.{' '}
          <Link to="/events/new">Post one</Link>
        </p>
      )}
    </article>
  )
}

export default ProfilePage
