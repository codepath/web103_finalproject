import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'
import ConfirmModal from '../components/ConfirmModal'
import Countdown from '../components/Countdown'
import ErrorMessage from '../components/ErrorMessage'
import EventComments from '../components/EventComments'
import RsvpButton from '../components/RsvpButton'
import Spinner from '../components/Spinner'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'
import EventsAPI from '../services/EventsAPI'
import RsvpsAPI from '../services/RsvpsAPI'
import { formatEventRange, isPast } from '../utils/dates'
import { useLoad } from '../utils/useLoad'
import { useRsvp } from '../utils/useRsvp'
import NotFound from './NotFound'
import '../css/EventDetails.css'

// the host's list of who answered, with a headcount
const AttendeeList = ({ eventId }) => {
  const { data, error, loading, reload } = useLoad(() => RsvpsAPI.getEventRsvps(eventId), [eventId])

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section className="attendees">
      <h2>
        {data.attending} of {data.capacity} attending
      </h2>
      <ul aria-label="Attendees">
        {data.rsvps.map((rsvp) => (
          <li key={rsvp.rsvp_id}>
            <Link to={`/users/${rsvp.user_id}`}>{rsvp.full_name}</Link> <span>{rsvp.rsvp_status.replaceAll('_', ' ')}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// the event itself, once it has loaded
const EventView = ({ event, statuses }) => {
  const { user } = useSession()
  const navigate = useNavigate()
  const { notify } = useToast()

  const rsvp = useRsvp(event, statuses)
  const [deleteProblem, setDeleteProblem] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [confirmingStop, setConfirmingStop] = useState(false)

  const hasStarted = isPast(event.start_time, event.timezone)
  const hasEnded = isPast(event.end_time ?? event.start_time, event.timezone)
  const isOwner = Boolean(user) && user.user_id === event.host_id

  // say so when the person's answer was saved
  const attend = async () => {
    if (await rsvp.attend()) notify(`You are attending ${event.event_title}.`)
  }

  // after the person confirmed that they will not come
  const stopAttending = async () => {
    setConfirmingStop(false)
    if (await rsvp.notAttend()) notify(`You are no longer attending ${event.event_title}.`)
  }

  // delete the event after the host confirmed, then go back to the list
  const deleteEvent = async () => {
    setConfirmingDelete(false)
    setDeleteProblem(null)

    try {
      await EventsAPI.deleteEvent(event.event_id)
      notify('Event deleted.')
      navigate('/events')
    } catch (error) {
      setDeleteProblem(error.message)
    }
  }

  return (
    <article className="event-details">
      <BackButton />

      {event.event_image_url && <img className="event-cover" src={event.event_image_url} alt="" />}

      <h1>{event.event_title}</h1>
      {hasEnded && <p className="badge">Past event</p>}

      <p>
        Hosted by <Link to={`/users/${event.host_id}`}>{event.host_name}</Link> in <Link to={`/groups/${event.group_id}`}>{event.group_name}</Link>
      </p>
      <p>{formatEventRange(event.start_time, event.end_time, event.timezone)}</p>
      <Countdown start={event.start_time} end={event.end_time} timezone={event.timezone} />
      {event.venue_id === null ? (
        <>
          <p>
            <strong>Online</strong>
          </p>
          {/* the server only gives the meeting link to people who are logged in */}
          {event.meeting_link ? (
            <p>
              Meeting link:{' '}
              <a href={event.meeting_link} target="_blank" rel="noreferrer">
                {event.meeting_link}
              </a>
            </p>
          ) : (
            <p>Log in to see the meeting link.</p>
          )}
        </>
      ) : (
        <>
          <p>
            <strong>{event.venue_name}</strong>
          </p>
          <p>{`${event.address}, ${event.city}, ${event.state} ${event.postal_code}`}</p>
        </>
      )}
      <p>{event.description}</p>
      <p>
        {rsvp.attendingCount} of {event.capacity} attending
      </p>

      {/* the host of the event does not attend it; visitors log in first; everyone else can answer */}
      {isOwner ? (
        <p>You host this event.</p>
      ) : user ? (
        <RsvpButton
          isAttending={rsvp.isAttending}
          isFull={rsvp.isFull}
          hasStarted={hasStarted}
          busy={rsvp.busy}
          onAttend={attend}
          onNotAttend={() => setConfirmingStop(true)}
        />
      ) : (
        <Link className="orbit-button" to="/login" state={{ from: `/events/${event.event_id}` }}>
          Join
        </Link>
      )}

      {(rsvp.problem ?? deleteProblem) && <ErrorMessage message={rsvp.problem ?? deleteProblem} />}

      {isOwner && (
        <section className="host-tools">
          <Link to={`/events/${event.event_id}/edit`}>Edit</Link>
          <button type="button" className="danger" onClick={() => setConfirmingDelete(true)}>
            Delete
          </button>
          <AttendeeList eventId={event.event_id} />
        </section>
      )}

      <ConfirmModal
        open={confirmingStop}
        title="Stop attending?"
        message="You can attend again later if there is still room."
        confirmLabel="Stop attending"
        cancelLabel="Keep my spot"
        onConfirm={stopAttending}
        onCancel={() => setConfirmingStop(false)}
      />

      <ConfirmModal
        open={confirmingDelete}
        title="Delete this event?"
        message="This removes the event and every RSVP for it. It cannot be undone."
        confirmLabel="Delete"
        onConfirm={deleteEvent}
        onCancel={() => setConfirmingDelete(false)}
      />

      <EventComments eventId={event.event_id} />
    </article>
  )
}

// the page for one event: load it and the RSVP answer words, then show it
const EventDetails = () => {
  const { eventId } = useParams()
  const { data: event, error, notFound, loading, reload } = useLoad(() => EventsAPI.getEvent(eventId), [eventId])
  const { data: statuses } = useLoad(() => RsvpsAPI.getRsvpStatuses().catch(() => null))

  if (loading) return <Spinner />
  if (notFound) return <NotFound />
  if (error) {
    return (
      <div className="event-details">
        <BackButton />
        <ErrorMessage message={error} onRetry={reload} />
      </div>
    )
  }

  return <EventView event={event} statuses={statuses} />
}

export default EventDetails
