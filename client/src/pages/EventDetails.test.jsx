// these tests check the event page: its details, the RSVP choices and the host's own tools
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionContext } from '../context/SessionContext'
import { ToastContext } from '../context/ToastContext'
import { ApiError } from '../utils/request'

// replace the services with ones the test controls
vi.mock('../services/EventsAPI', () => ({ default: { getEvent: vi.fn(), deleteEvent: vi.fn() } }))
vi.mock('../services/RsvpsAPI', () => ({
  default: { joinEvent: vi.fn(), changeRsvp: vi.fn(), getEventRsvps: vi.fn(), getRsvpStatuses: vi.fn() },
}))
vi.mock('../services/CommentsAPI', () => ({ default: { getComments: vi.fn() } }))

const { default: EventsAPI } = await import('../services/EventsAPI')
const { default: RsvpsAPI } = await import('../services/RsvpsAPI')
const { default: CommentsAPI } = await import('../services/CommentsAPI')
const { default: EventDetails } = await import('./EventDetails')

// the pop-up messages the page asks for
const notify = vi.fn()

const event = {
  event_id: 7,
  group_id: 3,
  event_title: 'Open Source Saturday',
  description: 'Bring a laptop.',
  group_name: 'Code & Coffee',
  host_id: 5,
  host_name: 'Hank Cole',
  start_time: '2099-01-19T20:30:00',
  end_time: '2099-01-19T22:00:00',
  venue_name: 'City Hall',
  address: '500 W 2nd St',
  city: 'Austin',
  state: 'TX',
  postal_code: '78701',
  capacity: 10,
  rsvp_count: 3,
  my_rsvp: null,
  is_attending: false,
}

const statuses = { attending: 'going-word', notAttending: 'not-word' }
const attendee = { user_id: 1, is_host: false }
const owner = { user_id: 5, is_host: true }
const otherHost = { user_id: 6, is_host: true }

// draw the page for a person (or a visitor), with pretend pages to land on
const renderDetails = (user = null) =>
  render(
    <ToastContext.Provider value={{ notify }}>
      <SessionContext.Provider value={{ user, needsOnboarding: false, loading: false, signOut: vi.fn() }}>
      <MemoryRouter initialEntries={['/events/7']}>
        <Routes>
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/events" element={<p>events list page</p>} />
        </Routes>
      </MemoryRouter>
    </SessionContext.Provider>
    </ToastContext.Provider>,
  )

beforeEach(() => {
  notify.mockReset()
  for (const service of [EventsAPI, RsvpsAPI, CommentsAPI]) for (const fn of Object.values(service)) fn.mockReset()
  EventsAPI.getEvent.mockResolvedValue(event)
  RsvpsAPI.getRsvpStatuses.mockResolvedValue(statuses)
  RsvpsAPI.joinEvent.mockResolvedValue({})
  RsvpsAPI.changeRsvp.mockResolvedValue({})
  CommentsAPI.getComments.mockResolvedValue([])
})

describe('EventDetails', () => {
  it('shows the event, its host and group as links, the venue and how full it is', async () => {
    renderDetails()

    expect(await screen.findByRole('heading', { name: 'Open Source Saturday' })).toBeInTheDocument()
    expect(screen.getByText('Bring a laptop.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hank Cole' })).toHaveAttribute('href', '/users/5')
    expect(screen.getByRole('link', { name: 'Code & Coffee' })).toHaveAttribute('href', '/groups/3')
    expect(screen.getByText('Mon, Jan 19 - 8:30 PM to 10:00 PM')).toBeInTheDocument()
    expect(screen.getByText(/^Starts in /)).toBeInTheDocument()
    expect(screen.getByText('City Hall')).toBeInTheDocument()
    expect(screen.getByText('500 W 2nd St, Austin, TX 78701')).toBeInTheDocument()
    expect(screen.getByText('3 of 10 attending')).toBeInTheDocument()
    expect(EventsAPI.getEvent).toHaveBeenCalledWith('7')
  })

  it('shows an error with a retry when the event cannot be loaded', async () => {
    EventsAPI.getEvent.mockRejectedValueOnce(new Error('Event not found.')).mockResolvedValueOnce(event)
    renderDetails()

    expect(await screen.findByRole('alert')).toHaveTextContent('Event not found.')
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { name: 'Open Source Saturday' })).toBeInTheDocument()
  })
})

describe('Back option', () => {
  it('is on the event page and on its error page', async () => {
    renderDetails()
    expect(await screen.findByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('is still there when the event cannot be loaded', async () => {
    EventsAPI.getEvent.mockRejectedValue(new Error('Event not found.'))
    renderDetails()

    expect(await screen.findByRole('alert')).toHaveTextContent('Event not found.')
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })
})

describe('RSVP', () => {
  it('shows a visitor the whole event, with a Join link to log in instead of RSVP buttons', async () => {
    renderDetails()

    expect(await screen.findByRole('heading', { name: 'Open Source Saturday' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Join' })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: 'Attend' })).not.toBeInTheDocument()
  })

  it('lets an attendee join, and shows the new count straight away', async () => {
    renderDetails(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Attend' }))

    expect(await screen.findByText('4 of 10 attending')).toBeInTheDocument()
    expect(RsvpsAPI.joinEvent).toHaveBeenCalledWith(7)
    expect(screen.getByRole('button', { name: 'Not attending' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
  })

  it('switches someone who said no to going, using the answer word from the server', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...event, my_rsvp: 'not-word', is_attending: false })
    renderDetails(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Attend' }))

    expect(RsvpsAPI.changeRsvp).toHaveBeenCalledWith(7, 'going-word')
    expect(await screen.findByText('4 of 10 attending')).toBeInTheDocument()
  })

  it('switches someone who is going to not attending', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...event, my_rsvp: 'going-word', is_attending: true })
    renderDetails(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Not attending' }))
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Stop attending' }))

    expect(RsvpsAPI.changeRsvp).toHaveBeenCalledWith(7, 'not-word')
    expect(await screen.findByText('2 of 10 attending')).toBeInTheDocument()
  })

  it('puts the count back and shows the reason when the server says no', async () => {
    RsvpsAPI.joinEvent.mockRejectedValue(new Error('This event is full.'))
    renderDetails(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Attend' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('This event is full.')
    expect(screen.getByText('3 of 10 attending')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Attend' })).toBeInTheDocument()
  })

  it('disables joining when the event is full', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...event, rsvp_count: 10 })
    renderDetails(attendee)

    expect(await screen.findByRole('button', { name: 'Event is full' })).toBeDisabled()
  })

  it('marks a past event and blocks changing answers', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...event, start_time: '2000-01-01T10:00:00', end_time: '2000-01-01T11:00:00' })
    renderDetails(attendee)

    expect(await screen.findByText('Past event')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Event has started' })).toBeDisabled()
  })
})

describe('host tools', () => {
  it('shows Edit, Delete and the attendee list to the host who organizes the event', async () => {
    RsvpsAPI.getEventRsvps.mockResolvedValue({
      capacity: 10,
      attending: 1,
      counts: { 'going-word': 1, 'not-word': 1 },
      rsvps: [
        { rsvp_id: 1, rsvp_status: 'going-word', user_id: 1, full_name: 'Ana Lee' },
        { rsvp_id: 2, rsvp_status: 'not-word', user_id: 2, full_name: 'Bo Chen' },
      ],
    })
    renderDetails(owner)

    expect(await screen.findByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/events/7/edit')
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    const list = await screen.findByRole('list', { name: 'Attendees' })
    expect(within(list).getByText('Ana Lee')).toBeInTheDocument()
    expect(within(list).getByText('Bo Chen')).toBeInTheDocument()
  })

  it('does not show host tools to another host or an attendee', async () => {
    renderDetails(otherHost)

    await screen.findByRole('heading', { name: 'Open Source Saturday' })

    expect(screen.queryByRole('link', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(RsvpsAPI.getEventRsvps).not.toHaveBeenCalled()
  })

  it('deletes the event only after the host confirms, then goes back to the list', async () => {
    RsvpsAPI.getEventRsvps.mockResolvedValue({ capacity: 10, attending: 0, counts: {}, rsvps: [] })
    EventsAPI.deleteEvent.mockResolvedValue(null)
    renderDetails(owner)

    await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))
    expect(EventsAPI.deleteEvent).not.toHaveBeenCalled()

    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }))

    expect(EventsAPI.deleteEvent).toHaveBeenCalledWith(7)
    expect(await screen.findByText('events list page')).toBeInTheDocument()
  })

  it('keeps the event and shows the reason when deleting fails', async () => {
    RsvpsAPI.getEventRsvps.mockResolvedValue({ capacity: 10, attending: 0, counts: {}, rsvps: [] })
    EventsAPI.deleteEvent.mockRejectedValue(new Error('Could not reach the server.'))
    renderDetails(owner)

    await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('Could not reach the server.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Open Source Saturday' })).toBeInTheDocument()
  })
})

describe('pop-ups', () => {
  it('says so when the person starts attending', async () => {
    renderDetails(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Attend' }))

    await waitFor(() => expect(notify).toHaveBeenCalledWith('You are attending Open Source Saturday.'))
  })

  it('says nothing when attending did not work', async () => {
    RsvpsAPI.joinEvent.mockRejectedValue(new Error('This event is full.'))
    renderDetails(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Attend' }))
    await screen.findByRole('alert')

    expect(notify).not.toHaveBeenCalled()
  })

  it('asks "are you sure?" before saying not attending, and changes nothing when the person keeps their spot', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...event, my_rsvp: 'going-word', is_attending: true })
    renderDetails(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Not attending' }))
    const question = screen.getByRole('alertdialog', { name: 'Stop attending?' })
    expect(RsvpsAPI.changeRsvp).not.toHaveBeenCalled()

    await userEvent.click(within(question).getByRole('button', { name: 'Keep my spot' }))

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(RsvpsAPI.changeRsvp).not.toHaveBeenCalled()
    expect(screen.getByText('3 of 10 attending')).toBeInTheDocument()
    expect(notify).not.toHaveBeenCalled()
  })

  it('says so after the person confirms they will not attend', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...event, my_rsvp: 'going-word', is_attending: true })
    renderDetails(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Not attending' }))
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Stop attending' }))

    await waitFor(() => expect(notify).toHaveBeenCalledWith('You are no longer attending Open Source Saturday.'))
  })

  it('says the event was deleted', async () => {
    RsvpsAPI.getEventRsvps.mockResolvedValue({ capacity: 10, attending: 0, counts: {}, rsvps: [] })
    EventsAPI.deleteEvent.mockResolvedValue(null)
    renderDetails(owner)

    await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }))

    await waitFor(() => expect(notify).toHaveBeenCalledWith('Event deleted.'))
  })
})

describe('an event that does not exist', () => {
  it('shows the 404 page', async () => {
    EventsAPI.getEvent.mockRejectedValue(new ApiError(404, 'Event not found.'))
    renderDetails()

    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})

describe('the host of the event', () => {
  it('is not offered Attend or Not attending for their own event, and is told they host it', async () => {
    RsvpsAPI.getEventRsvps.mockResolvedValue({ capacity: 10, attending: 0, counts: {}, rsvps: [] })
    renderDetails(owner)

    expect(await screen.findByText('You host this event.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Attend' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Not attending' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Join' })).not.toBeInTheDocument()
  })

  it('can attend an event that another host runs', async () => {
    renderDetails(otherHost)

    expect(await screen.findByRole('button', { name: 'Attend' })).toBeInTheDocument()
    expect(screen.queryByText('You host this event.')).not.toBeInTheDocument()
  })
})

describe('time zone', () => {
  it('shows the time zone of the venue after the time, and counts down to that moment', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...event, timezone: 'America/Chicago' })
    renderDetails()

    expect(await screen.findByText('Mon, Jan 19 - 8:30 PM to 10:00 PM CST')).toBeInTheDocument()
    expect(screen.getByText(/^Starts in /)).toBeInTheDocument()
  })
})

describe('an online event', () => {
  const onlineEvent = { ...event, venue_id: null, venue_name: null, address: null, city: null, state: null, postal_code: null, latitude: null, longitude: null }

  it('shows Online and the meeting link to a logged-in person', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...onlineEvent, meeting_link: 'https://meet.example.com/abc' })
    renderDetails(attendee)

    expect(await screen.findByText('Online')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'https://meet.example.com/abc' })
    expect(link).toHaveAttribute('href', 'https://meet.example.com/abc')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    expect(screen.queryByText('City Hall')).not.toBeInTheDocument()
  })

  it('asks a visitor to log in to see the meeting link, since the server does not give it to them', async () => {
    EventsAPI.getEvent.mockResolvedValue({ ...onlineEvent, meeting_link: null })
    renderDetails()

    expect(await screen.findByText('Online')).toBeInTheDocument()
    expect(screen.getByText('Log in to see the meeting link.')).toBeInTheDocument()
  })
})
