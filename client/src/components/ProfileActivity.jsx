import { useState } from 'react'
import UsersAPI from '../services/UsersAPI'
import { useLoad } from '../utils/useLoad'
import EmptyState from './EmptyState'
import ErrorMessage from './ErrorMessage'
import EventCard from './EventCard'
import GroupCard from './GroupCard'
import Spinner from './Spinner'
import '../css/Profile.css'

// pick which list to show: the first non-empty choice, or the first choice if all are empty
const pickTab = (chosen, ...choices) => chosen ?? (choices.find((c) => c.items.length > 0)?.key ?? choices[0].key)

// a row of choice buttons, each with how many items it holds; every choice is always there, even with nothing in it
const Tabs = ({ choices, active, onChoose }) => (
  <div className="profile-tabs">
    {choices.map((choice) => (
      <button key={choice.key} type="button" aria-pressed={active === choice.key} onClick={() => onChoose(choice.key)}>
        {choice.label} ({choice.items.length})
      </button>
    ))}
  </div>
)

// the events a person goes to or hosts, and the groups they joined or organize (one list at a time, chosen with the buttons);
// hosted events and organized groups come first for people who have any
const ProfileActivity = ({ userId, isSelf }) => {
  const { data, error, loading, reload } = useLoad(
    async () => {
      const [events, groups] = await Promise.all([UsersAPI.getUserEvents(userId), UsersAPI.getUserGroups(userId)])
      return { events, groups }
    },
    [userId],
  )
  const [eventTab, setEventTab] = useState(null)
  const [groupTab, setGroupTab] = useState(null)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  const attending = { key: 'attending', label: 'Attending', items: data.events.filter((event) => event.role === 'attending') }
  const hosted = { key: 'hosted', label: 'Hosted', items: data.events.filter((event) => event.role === 'created') }
  const joined = { key: 'joined', label: 'Joined', items: data.groups.filter((group) => group.role === 'member') }
  const organized = { key: 'organized', label: 'Organized', items: data.groups.filter((group) => group.role === 'organizer') }
  const saved = { key: 'saved', label: 'Saved', items: data.groups.filter((group) => group.role === 'saved') }

  // a person who hosts sees what they host and organize first, since that is what they mostly care about
  const eventChoices = hosted.items.length > 0 ? [hosted, attending] : [attending, hosted]
  const groupChoices = isSelf
    ? (organized.items.length > 0 ? [organized, joined, saved] : [joined, organized, saved])
    : (organized.items.length > 0 ? [organized, joined] : [joined, organized])

  const activeEvents = pickTab(eventTab, ...eventChoices)
  const activeGroups = pickTab(groupTab, ...groupChoices)
  const shownEvents = eventChoices.find((choice) => choice.key === activeEvents).items
  const shownGroups = groupChoices.find((choice) => choice.key === activeGroups).items

  return (
    <>
      <section className="profile-section">
        <h2>{isSelf ? 'My events' : 'Events'}</h2>
        <Tabs choices={eventChoices} active={activeEvents} onChoose={setEventTab} />

        {shownEvents.length === 0 ? (
          <EmptyState title="No events yet" message={isSelf ? 'Join an event and it will show up here.' : 'Nothing to show yet.'} actionLabel={isSelf ? 'Find events' : undefined} actionTo="/events" />
        ) : (
          <div className="card-grid">
            {shownEvents.map((event) => (
              <div key={event.event_id}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2>{isSelf ? 'My groups' : 'Groups'}</h2>
        <Tabs choices={groupChoices} active={activeGroups} onChoose={setGroupTab} />

        {shownGroups.length === 0 ? (
          <EmptyState title="No groups yet" message={isSelf ? 'Join a group and it will show up here.' : 'Nothing to show yet.'} actionLabel={isSelf ? 'Find groups' : undefined} actionTo="/groups" />
        ) : (
          <div className="card-grid">
            {shownGroups.map((group) => (
              <div key={group.group_id}>
                <GroupCard group={group} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default ProfileActivity
