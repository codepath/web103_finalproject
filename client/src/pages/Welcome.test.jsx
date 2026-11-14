// these tests check the home page: a map of upcoming events with the filters and no event list, exactly the same for visitors and for people who are logged in
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionContext } from '../context/SessionContext'

// replace the services, and the map (tested on its own), with ones the test controls
vi.mock('../services/EventsAPI', () => ({ default: { getEvents: vi.fn(), getEventPins: vi.fn() } }))
vi.mock('../services/UsersAPI', () => ({ default: { getUserEvents: vi.fn(), getUserGroups: vi.fn() } }))
vi.mock('../services/CategoriesAPI', () => ({ default: { getCategories: vi.fn().mockResolvedValue([]) } }))
vi.mock('../services/CitiesAPI', () => ({ default: { getCities: vi.fn().mockResolvedValue([]) } }))
vi.mock('../components/EventMap', () => ({
  default: ({ pins, activeId, onSelect }) => (
    <div data-testid="map" data-active={activeId ?? ''}>
      {pins.map((pin) => (
        <button key={pin.event_id} type="button" onClick={() => onSelect(pin.event_id)}>
          {`pin ${pin.event_id}`}
        </button>
      ))}
    </div>
  ),
}))

const { default: EventsAPI } = await import('../services/EventsAPI')
const { default: UsersAPI } = await import('../services/UsersAPI')
const { default: Welcome } = await import('./Welcome')

const pins = [
  { event_id: 1, event_title: 'Open Source Saturday', latitude: 30, longitude: -97, start_time: '2027-01-19T20:30:00', category: 'Technology', rsvp_count: 3 },
  { event_id: 2, event_title: 'Open Studio Evening', latitude: 32, longitude: -96, start_time: '2027-01-20T18:00:00', category: 'Arts', rsvp_count: 8 },
]

// draw the page for a session
const renderWelcome = (session = {}, address = '/') =>
  render(
    <SessionContext.Provider value={{ user: null, needsOnboarding: false, loading: false, signOut: vi.fn(), ...session }}>
      <MemoryRouter initialEntries={[address]}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/events/:eventId" element={<p>{'event page'}</p>} />
        </Routes>
      </MemoryRouter>
    </SessionContext.Provider>,
  )

beforeEach(() => {
  EventsAPI.getEvents.mockReset()
  EventsAPI.getEventPins.mockReset()
  EventsAPI.getEventPins.mockResolvedValue(pins)
  UsersAPI.getUserEvents.mockReset()
  UsersAPI.getUserGroups.mockReset()
  UsersAPI.getUserEvents.mockResolvedValue([])
  UsersAPI.getUserGroups.mockResolvedValue([])
})

describe('Welcome for a visitor', () => {
  it('shows the pitch, the filters and a map of upcoming events, and no list of events', async () => {
    renderWelcome()

    expect(screen.getByRole('heading', { name: 'FIND YOUR ORBIT' })).toBeInTheDocument()
    expect(screen.getByLabelText('Search Event or Group')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'pin 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'pin 2' })).toBeInTheDocument()
    expect(EventsAPI.getEventPins).toHaveBeenCalledWith({ upcoming: 'true' })
    expect(EventsAPI.getEvents).not.toHaveBeenCalled()
    expect(screen.queryByText(/^Showing /)).not.toBeInTheDocument()
  })

  it('leaves out the items-per-page choice, since there is no list to cut into pages', () => {
    renderWelcome()

    expect(screen.queryByLabelText('Items per page')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Upcoming only')).toBeChecked()
  })

  it('moves the map to the events that match the filters in the address', async () => {
    renderWelcome({}, '/?city=Austin')
    await screen.findByRole('button', { name: 'pin 1' })

    expect(EventsAPI.getEventPins).toHaveBeenCalledWith({ upcoming: 'true', city: 'Austin' })
  })

  it('goes straight to the event when a pin is clicked, with no panel in between', async () => {
    renderWelcome()

    await userEvent.click(await screen.findByRole('button', { name: 'pin 2' }))

    expect(await screen.findByText('event page')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows an error with a retry when the map cannot be loaded', async () => {
    EventsAPI.getEventPins.mockRejectedValueOnce(new Error('Could not load the map.')).mockResolvedValueOnce(pins)
    renderWelcome()

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load the map.')
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('button', { name: 'pin 1' })).toBeInTheDocument()
  })
})

const attendingEvent = { event_id: 31, event_title: 'Jazz Night', group_name: 'Jazz Club', start_time: '2099-01-19T20:30:00', end_time: '2099-01-19T22:00:00', city: 'Austin', state: 'TX', rsvp_count: 3, role: 'attending' }
const hostedEvent = { ...attendingEvent, event_id: 32, event_title: 'Code Day', role: 'created' }
const joinedGroup = { group_id: 10, group_name: 'Jazz Club', category: 'Music', member_count: 3, role: 'member' }
const organizedGroup = { group_id: 11, group_name: 'Code & Coffee', category: 'Technology', member_count: 8, role: 'organizer' }
const person = { user_id: 1, is_host: true }

describe('Welcome for a logged-in person', () => {
  it('has the same pitch, filters and map as a visitor, with no redirect', async () => {
    renderWelcome({ user: person })

    expect(screen.getByRole('heading', { name: 'FIND YOUR ORBIT' })).toBeInTheDocument()
    expect(screen.getByLabelText('Search Event or Group')).toBeInTheDocument()
    expect(screen.queryByLabelText('Items per page')).not.toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'pin 1' })).toBeInTheDocument()
    expect(EventsAPI.getEventPins).toHaveBeenCalledWith({ upcoming: 'true' })
    expect(EventsAPI.getEvents).not.toHaveBeenCalled()
  })

  it('also shows My events and My groups, below the map', async () => {
    UsersAPI.getUserEvents.mockResolvedValue([attendingEvent])
    UsersAPI.getUserGroups.mockResolvedValue([joinedGroup])
    renderWelcome({ user: person })

    const events = await screen.findByRole('heading', { name: 'My events' })
    const groups = screen.getByRole('heading', { name: 'My groups' })
    const map = await screen.findByTestId('map')

    expect(map.compareDocumentPosition(events) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(events.compareDocumentPosition(groups) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(UsersAPI.getUserEvents).toHaveBeenCalledWith(1)
    expect(UsersAPI.getUserGroups).toHaveBeenCalledWith(1)
  })

  it('shows the events they host first, and lets them switch to the ones they attend', async () => {
    UsersAPI.getUserEvents.mockResolvedValue([attendingEvent, hostedEvent])
    renderWelcome({ user: person })

    expect(await screen.findByText('Code Day')).toBeInTheDocument()
    expect(screen.queryByText('Jazz Night')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hosted (1)' })).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(screen.getByRole('button', { name: 'Attending (1)' }))

    expect(screen.getByText('Jazz Night')).toBeInTheDocument()
    expect(screen.queryByText('Code Day')).not.toBeInTheDocument()
  })

  it('shows the groups they organize first, and lets them switch to the ones they joined', async () => {
    UsersAPI.getUserGroups.mockResolvedValue([joinedGroup, organizedGroup])
    renderWelcome({ user: person })

    expect(await screen.findByText('Code & Coffee')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Organized (1)' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByText('Jazz Club')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Joined (1)' }))

    expect(screen.getByText('Jazz Club')).toBeInTheDocument()
    expect(screen.queryByText('Code & Coffee')).not.toBeInTheDocument()
  })

  it('shows an attendee their attending events and joined groups first, with the Hosted and Organized buttons still there', async () => {
    UsersAPI.getUserEvents.mockResolvedValue([attendingEvent])
    UsersAPI.getUserGroups.mockResolvedValue([joinedGroup])
    renderWelcome({ user: { user_id: 2, is_host: false } })

    expect(await screen.findByText('Jazz Night')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Attending (1)' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Joined (1)' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Hosted (0)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Organized (0)' })).toBeInTheDocument()
  })
})

describe('Welcome for a visitor has no personal sections', () => {
  it('shows neither My events nor My groups, and asks for nobody\'s events', async () => {
    renderWelcome()
    await screen.findByRole('button', { name: 'pin 1' })

    expect(screen.queryByRole('heading', { name: 'My events' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'My groups' })).not.toBeInTheDocument()
    expect(UsersAPI.getUserEvents).not.toHaveBeenCalled()
  })
})
