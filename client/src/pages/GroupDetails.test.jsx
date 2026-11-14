// these tests check the group page: visitors can read it, and only joining asks them to log in
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionContext } from '../context/SessionContext'
import { ToastContext } from '../context/ToastContext'
import { ApiError } from '../utils/request'

// replace the services with ones the test controls
vi.mock('../services/EventsAPI', () => ({ default: { getEvents: vi.fn() } }))
vi.mock('../services/GroupsAPI', () => ({ default: { getGroup: vi.fn(), joinGroup: vi.fn(), leaveGroup: vi.fn(), deleteGroup: vi.fn(), saveGroup: vi.fn(), unsaveGroup: vi.fn() } }))

const { default: EventsAPI } = await import('../services/EventsAPI')
const { default: GroupsAPI } = await import('../services/GroupsAPI')
const { default: GroupDetails } = await import('./GroupDetails')

// the pop-up messages the page asks for
const notify = vi.fn()

const group = {
  group_id: 3,
  group_name: 'Code & Coffee',
  category: 'Technology',
  description: 'A friendly meetup.',
  organizer_id: 5,
  organizer_name: 'Hank Cole',
  member_count: 40,
}

const events = [{ event_id: 1, event_title: 'Open Source Saturday', group_name: 'Code & Coffee', start_time: '2099-01-19T20:30:00', city: 'Austin', state: 'TX', rsvp_count: 3 }]

const attendee = { user_id: 1, is_host: false }
const organizer = { user_id: 5, is_host: true }

// draw the page for a person (or a visitor), with pretend pages to land on
const renderGroup = (user = null) =>
  render(
    <ToastContext.Provider value={{ notify }}>
      <SessionContext.Provider value={{ user, needsOnboarding: false, loading: false, signOut: vi.fn() }}>
      <MemoryRouter initialEntries={['/groups/3']}>
        <Routes>
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/groups" element={<p>groups list page</p>} />
        </Routes>
      </MemoryRouter>
    </SessionContext.Provider>
    </ToastContext.Provider>,
  )

beforeEach(() => {
  notify.mockReset()
  for (const service of [EventsAPI, GroupsAPI]) for (const fn of Object.values(service)) fn.mockReset()
  GroupsAPI.getGroup.mockResolvedValue(group)
  GroupsAPI.joinGroup.mockResolvedValue({})
  GroupsAPI.leaveGroup.mockResolvedValue(null)
  EventsAPI.getEvents.mockResolvedValue(events)
})

describe('GroupDetails for a visitor', () => {
  it('shows the whole group and its upcoming events, with a Join link to log in and a Back button', async () => {
    renderGroup()

    expect(await screen.findByRole('heading', { name: 'Code & Coffee' })).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('A friendly meetup.')).toBeInTheDocument()
    expect(screen.getByText('40 members')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hank Cole' })).toHaveAttribute('href', '/users/5')
    expect(await screen.findByText('Open Source Saturday')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Join' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(EventsAPI.getEvents).toHaveBeenCalledWith({ group_id: 3, upcoming: 'true' })
  })

  it('says so when the group has no upcoming events', async () => {
    EventsAPI.getEvents.mockResolvedValue([])
    renderGroup()

    expect(await screen.findByText('No upcoming events')).toBeInTheDocument()
  })

  it('shows an error with a retry and a Back button when the group cannot be loaded', async () => {
    GroupsAPI.getGroup.mockRejectedValueOnce(new Error('Group not found.')).mockResolvedValueOnce(group)
    renderGroup()

    expect(await screen.findByRole('alert')).toHaveTextContent('Group not found.')
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { name: 'Code & Coffee' })).toBeInTheDocument()
  })
})

describe('GroupDetails for a logged-in person', () => {
  it('lets an attendee join, with the new member count straight away', async () => {
    renderGroup(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Join' }))

    expect(await screen.findByText('41 members')).toBeInTheDocument()
    expect(GroupsAPI.joinGroup).toHaveBeenCalledWith(3)
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument()
  })

  it('lets a member leave', async () => {
    GroupsAPI.getGroup.mockResolvedValue({ ...group, is_member: true })
    renderGroup(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Leave' }))
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Leave group' }))

    expect(await screen.findByText('39 members')).toBeInTheDocument()
    expect(GroupsAPI.leaveGroup).toHaveBeenCalledWith(3)
    expect(screen.getByRole('button', { name: 'Join' })).toBeInTheDocument()
  })

  it('puts the count back and shows the reason when the server says no', async () => {
    GroupsAPI.joinGroup.mockRejectedValue(new Error('You are already a member.'))
    renderGroup(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Join' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('You are already a member.')
    expect(screen.getByText('40 members')).toBeInTheDocument()
  })
})

describe('GroupDetails for the organizer', () => {
  it('shows no Join or Leave, but Create event, Edit and Delete', async () => {
    renderGroup(organizer)

    expect(await screen.findByText('You organize this group.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Join' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Leave' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create event' })).toHaveAttribute('href', '/events/new?group=3')
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/groups/3/edit')
  })

  it('deletes only after confirming, then goes back to the list', async () => {
    GroupsAPI.deleteGroup.mockResolvedValue(null)
    renderGroup(organizer)

    await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))
    expect(GroupsAPI.deleteGroup).not.toHaveBeenCalled()

    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }))

    expect(GroupsAPI.deleteGroup).toHaveBeenCalledWith(3)
    expect(await screen.findByText('groups list page')).toBeInTheDocument()
  })

  it('does not show these tools to another host', async () => {
    renderGroup({ user_id: 6, is_host: true })

    await screen.findByRole('heading', { name: 'Code & Coffee' })

    expect(screen.queryByRole('link', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })
})

describe('pop-ups', () => {
  it('says so when the person joins a group', async () => {
    renderGroup(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Join' }))

    await waitFor(() => expect(notify).toHaveBeenCalledWith('You joined Code & Coffee.'))
  })

  it('says nothing when joining did not work', async () => {
    GroupsAPI.joinGroup.mockRejectedValue(new Error('You are already a member.'))
    renderGroup(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Join' }))
    await screen.findByRole('alert')

    expect(notify).not.toHaveBeenCalled()
  })

  it('asks "are you sure?" before leaving, and stays in the group when told to', async () => {
    GroupsAPI.getGroup.mockResolvedValue({ ...group, is_member: true })
    renderGroup(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Leave' }))
    const question = screen.getByRole('alertdialog', { name: 'Leave this group?' })
    expect(GroupsAPI.leaveGroup).not.toHaveBeenCalled()

    await userEvent.click(within(question).getByRole('button', { name: 'Stay in the group' }))

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(GroupsAPI.leaveGroup).not.toHaveBeenCalled()
    expect(screen.getByText('40 members')).toBeInTheDocument()
  })

  it('says so after the person confirms leaving', async () => {
    GroupsAPI.getGroup.mockResolvedValue({ ...group, is_member: true })
    renderGroup(attendee)

    await userEvent.click(await screen.findByRole('button', { name: 'Leave' }))
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Leave group' }))

    await waitFor(() => expect(notify).toHaveBeenCalledWith('You left Code & Coffee.'))
  })

  it('says the group was deleted', async () => {
    GroupsAPI.deleteGroup.mockResolvedValue(null)
    renderGroup(organizer)

    await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }))

    await waitFor(() => expect(notify).toHaveBeenCalledWith('Group deleted.'))
  })
})

describe('a group that does not exist', () => {
  it('shows the 404 page', async () => {
    GroupsAPI.getGroup.mockRejectedValue(new ApiError(404, 'Group not found.'))
    renderGroup()

    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})
