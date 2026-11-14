import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import EventCard from '../components/EventCard'
import Spinner from '../components/Spinner'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'
import EventsAPI from '../services/EventsAPI'
import GroupsAPI from '../services/GroupsAPI'
import { useLoad } from '../utils/useLoad'
import NotFound from './NotFound'
import '../css/GroupDetails.css'

// the upcoming events of one group
const GroupEvents = ({ groupId }) => {
  const { data: events, error, loading, reload } = useLoad(() => EventsAPI.getEvents({ group_id: groupId, upcoming: 'true' }), [groupId])

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} onRetry={reload} />
  if (events.length === 0) return <EmptyState title="No upcoming events" message="This group has nothing planned yet." />

  return (
    <div className="card-grid">
      {events.map((event) => (
        <div key={event.event_id}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  )
}

// the group itself, once it has loaded
const GroupView = ({ group }) => {
  const { user } = useSession()
  const navigate = useNavigate()
  const { notify } = useToast()

  // whether the person joined, as they changed it on this page; until they change it, the server's answer is used
  const [joined, setJoined] = useState(null)
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [confirmingLeave, setConfirmingLeave] = useState(false)
  const [saved, setSaved] = useState(null)
  const [saveBusy, setSaveBusy] = useState(false)

  const isMember = joined ?? Boolean(group.is_member)
  const isOrganizer = Boolean(user) && user.user_id === group.organizer_id
  const isSaved = saved ?? Boolean(group.is_saved)

  // everyone else's count stays as the server gave it; only the person's own choice changes it
  const memberCount = group.member_count - (group.is_member ? 1 : 0) + (isMember ? 1 : 0)

  // show the new choice straight away, ask the server, and put the old choice back if the server says no
  const changeMembership = async (next, ask) => {
    const before = joined
    setJoined(next)
    setBusy(true)
    setProblem(null)

    try {
      await ask()
      return true
    } catch (error) {
      setJoined(before)
      setProblem(error.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  // join, and say so when it worked
  const join = async () => {
    if (await changeMembership(true, () => GroupsAPI.joinGroup(group.group_id))) notify(`You joined ${group.group_name}.`)
  }

  // leave, after the person confirmed
  const leave = async () => {
    setConfirmingLeave(false)
    if (await changeMembership(false, () => GroupsAPI.leaveGroup(group.group_id))) notify(`You left ${group.group_name}.`)
  }

  const toggleSave = async () => {
    const before = saved
    const next = !isSaved
    setSaved(next)
    setSaveBusy(true)
    try {
      if (next) {
        await GroupsAPI.saveGroup(group.group_id)
      } else {
        await GroupsAPI.unsaveGroup(group.group_id)
      }
    } catch {
      setSaved(before)
    } finally {
      setSaveBusy(false)
    }
  }

  // delete the group after the organizer confirmed, then go back to the list
  const deleteGroup = async () => {
    setConfirmingDelete(false)
    setProblem(null)

    try {
      await GroupsAPI.deleteGroup(group.group_id)
      notify('Group deleted.')
      navigate('/groups')
    } catch (error) {
      setProblem(error.message)
    }
  }

  return (
    <article className="group-details">
      <BackButton />

      {group.group_image_url && <img className="group-cover" src={group.group_image_url} alt="" />}

      <h1>{group.group_name}</h1>
      <p className="badge">{group.category}</p>
      <p>
        Organized by <Link to={`/users/${group.organizer_id}`}>{group.organizer_name}</Link>
      </p>
      {group.description && <p>{group.description}</p>}
      <p>{memberCount === 1 ? '1 member' : `${memberCount} members`}</p>

      {/* visitors log in first; the organizer cannot leave their own group */}
      {!user && (
        <Link className="orbit-button" to="/login" state={{ from: `/groups/${group.group_id}` }}>
          Join
        </Link>
      )}
      {user && isOrganizer && <p>You organize this group.</p>}
      {user && !isOrganizer && !isMember && (
        <button type="button" disabled={busy} onClick={join}>
          Join
        </button>
      )}
      {user && !isOrganizer && isMember && (
        <button type="button" className="secondary" disabled={busy} onClick={() => setConfirmingLeave(true)}>
          Leave
        </button>
      )}

      {user && !isOrganizer && (
        <button
          type="button"
          className={`save-button${isSaved ? ' saved' : ''}`}
          disabled={saveBusy}
          onClick={toggleSave}
          aria-label={isSaved ? 'Unsave group' : 'Save group'}
        >
          {isSaved ? '♥ Saved' : '♡ Save'}
        </button>
      )}

      {problem && <ErrorMessage message={problem} />}

      {isOrganizer && (
        <section className="host-tools">
          <Link to={`/events/new?group=${group.group_id}`}>Create event</Link>
          <Link to={`/groups/${group.group_id}/edit`}>Edit</Link>
          <button type="button" className="danger" onClick={() => setConfirmingDelete(true)}>
            Delete
          </button>
        </section>
      )}

      <h2>Upcoming events</h2>
      <GroupEvents groupId={group.group_id} />

      <ConfirmModal
        open={confirmingLeave}
        title="Leave this group?"
        message="You can join again later."
        confirmLabel="Leave group"
        cancelLabel="Stay in the group"
        onConfirm={leave}
        onCancel={() => setConfirmingLeave(false)}
      />

      <ConfirmModal
        open={confirmingDelete}
        title="Delete this group?"
        message="This removes the group, all of its events and every RSVP for them. It cannot be undone."
        confirmLabel="Delete"
        onConfirm={deleteGroup}
        onCancel={() => setConfirmingDelete(false)}
      />
    </article>
  )
}

// the page for one group: anyone can read it, and logging in is only asked for when they press Join
const GroupDetails = () => {
  const { groupId } = useParams()
  const { data: group, error, notFound, loading, reload } = useLoad(() => GroupsAPI.getGroup(groupId), [groupId])

  if (loading) return <Spinner />
  if (notFound) return <NotFound />

  if (error) {
    return (
      <div className="group-details">
        <BackButton />
        <ErrorMessage message={error} onRetry={reload} />
      </div>
    )
  }

  return <GroupView group={group} />
}

export default GroupDetails
