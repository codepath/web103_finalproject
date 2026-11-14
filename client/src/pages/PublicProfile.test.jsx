// these tests check anyone's profile: only public details, their events by tab, and their groups
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionContext } from '../context/SessionContext'
import { ApiError } from '../utils/request'

// replace the service with one the test controls
vi.mock('../services/UsersAPI', () => ({ default: { getUser: vi.fn(), getUserEvents: vi.fn(), getUserGroups: vi.fn() } }))

const { default: UsersAPI } = await import('../services/UsersAPI')
const { default: PublicProfile } = await import('./PublicProfile')

const person = { user_id: 5, full_name: 'Hank Cole', city: 'Austin', state: 'TX', user_image_url: null, user_type: 'x' }
const event = (id, title, role) => ({ event_id: id, event_title: title, group_name: 'Group', start_time: '2099-01-19T20:30:00', city: 'Austin', state: 'TX', rsvp_count: 1, role })
const group = (id, name, role) => ({ group_id: id, group_name: name, category: 'Food', member_count: 3, role })

// draw the page for a visitor, or for the person given
const renderProfile = (user = null) =>
  render(
    <SessionContext.Provider value={{ user, needsOnboarding: false, loading: false, signOut: vi.fn(), refresh: vi.fn() }}>
      <MemoryRouter initialEntries={['/users/5']}>
        <Routes>
          <Route path="/users/:userId" element={<PublicProfile />} />
          <Route path="/collection" element={<p>collection page</p>} />
        </Routes>
      </MemoryRouter>
    </SessionContext.Provider>,
  )

beforeEach(() => {
  for (const fn of Object.values(UsersAPI)) fn.mockReset()
  UsersAPI.getUser.mockResolvedValue(person)
  UsersAPI.getUserEvents.mockResolvedValue([event(1, 'Jazz Night', 'attending'), event(2, 'Code Day', 'created')])
  UsersAPI.getUserGroups.mockResolvedValue([group(10, 'Jazz Club', 'member'), group(11, 'Code & Coffee', 'organizer')])
})

describe('PublicProfile', () => {
  it('shows the name and place, and never an email', async () => {
    renderProfile()

    expect(await screen.findByRole('heading', { level: 1, name: 'Hank Cole' })).toBeInTheDocument()
    expect(screen.getByText('Austin, TX')).toBeInTheDocument()
    expect(screen.queryByText(/@/)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Edit my profile' })).not.toBeInTheDocument()
    expect(UsersAPI.getUser).toHaveBeenCalledWith('5')
  })

  it('shows the events they host first, and the ones they attend under an Attending tab', async () => {
    renderProfile()

    expect(await screen.findByText('Code Day')).toBeInTheDocument()
    expect(screen.queryByText('Jazz Night')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hosted (1)' })).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(screen.getByRole('button', { name: 'Attending (1)' }))

    expect(screen.getByText('Jazz Night')).toBeInTheDocument()
    expect(screen.queryByText('Code Day')).not.toBeInTheDocument()
  })

  it('puts the Hosted button before the Attending button for a person who hosts', async () => {
    renderProfile()
    await screen.findByText('Code Day')

    const events = screen.getByRole('heading', { name: 'Events' }).closest('section')
    const names = within(events).getAllByRole('button').map((button) => button.textContent)

    expect(names).toEqual(['Hosted (1)', 'Attending (1)'])
  })

  it('still shows the Hosted button, with nothing in it, for someone who hosts nothing', async () => {
    UsersAPI.getUserEvents.mockResolvedValue([event(1, 'Jazz Night', 'attending')])
    renderProfile()

    await screen.findByText('Jazz Night')

    expect(screen.getByRole('button', { name: 'Attending (1)' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Hosted (0)' }))
    expect(screen.getByText('No events yet')).toBeInTheDocument()
  })

  it('opens on the Hosted tab for a person who hosts but attends nothing', async () => {
    UsersAPI.getUserEvents.mockResolvedValue([event(2, 'Code Day', 'created')])
    renderProfile()

    expect(await screen.findByText('Code Day')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hosted (1)' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows the groups they organize first, and the ones they joined under a Joined button', async () => {
    renderProfile()
    await screen.findByText('Code Day')

    const groups = screen.getByRole('heading', { name: 'Groups' }).closest('section')
    expect(within(groups).getByText('Code & Coffee')).toBeInTheDocument()
    expect(within(groups).queryByText('Jazz Club')).not.toBeInTheDocument()
    expect(within(groups).getByRole('button', { name: 'Organized (1)' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(groups).getAllByRole('button').map((button) => button.textContent)).toEqual(['Organized (1)', 'Joined (1)'])

    await userEvent.click(within(groups).getByRole('button', { name: 'Joined (1)' }))

    expect(within(groups).getByText('Jazz Club')).toBeInTheDocument()
    expect(within(groups).queryByText('Code & Coffee')).not.toBeInTheDocument()
  })

  it('still shows the Organized button, with nothing in it, for someone who organizes no group', async () => {
    UsersAPI.getUserGroups.mockResolvedValue([group(10, 'Jazz Club', 'member')])
    renderProfile()
    await screen.findByText('Jazz Club')

    expect(screen.getByRole('button', { name: 'Organized (0)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Joined (1)' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('opens on Organized for a person who organizes a group but joined none', async () => {
    UsersAPI.getUserGroups.mockResolvedValue([group(11, 'Code & Coffee', 'organizer')])
    renderProfile()

    expect(await screen.findByText('Code & Coffee')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Organized (1)' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('says so when they belong to no groups', async () => {
    UsersAPI.getUserGroups.mockResolvedValue([])
    renderProfile()

    expect(await screen.findByText('No groups yet')).toBeInTheDocument()
  })

  it('sends you to My Collection when you look at your own address, instead of showing a second profile', async () => {
    renderProfile({ user_id: 5, is_host: true })

    expect(await screen.findByText('collection page')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Edit my profile' })).not.toBeInTheDocument()
    expect(UsersAPI.getUserEvents).not.toHaveBeenCalled()
  })

  it('shows another person\'s profile normally, with no edit link and the plain section names', async () => {
    renderProfile({ user_id: 9, is_host: true })

    expect(await screen.findByRole('heading', { name: 'Events' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Groups' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Edit my profile' })).not.toBeInTheDocument()
  })

  it('shows an error with a retry and a Back button when the person cannot be loaded', async () => {
    UsersAPI.getUser.mockRejectedValueOnce(new Error('User not found.')).mockResolvedValueOnce(person)
    renderProfile()

    expect(await screen.findByRole('alert')).toHaveTextContent('User not found.')
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Hank Cole' })).toBeInTheDocument()
  })

  it('shows the 404 page for a person who does not exist', async () => {
    UsersAPI.getUser.mockRejectedValue(new ApiError(404, 'User not found.'))
    renderProfile()

    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })

  it('shows an error with a retry when the events cannot be loaded', async () => {
    UsersAPI.getUserEvents.mockRejectedValueOnce(new Error('Could not reach the server.')).mockResolvedValueOnce([event(1, 'Jazz Night', 'attending')])
    renderProfile()

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not reach the server.')
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Jazz Night')).toBeInTheDocument()
  })
})
