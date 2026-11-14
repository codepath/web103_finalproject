// these tests check the My Collection page: the events and groups of the logged-in person
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionContext } from '../context/SessionContext'

// replace the service with one the test controls
vi.mock('../services/UsersAPI', () => ({ default: { getUserEvents: vi.fn(), getUserGroups: vi.fn() } }))

const { default: UsersAPI } = await import('../services/UsersAPI')
const { default: MyCollection } = await import('./MyCollection')

const event = (id, title, role) => ({ event_id: id, event_title: title, group_name: 'Group', start_time: '2099-01-19T20:30:00', city: 'Austin', state: 'TX', rsvp_count: 1, role })
const group = (id, name, role) => ({ group_id: id, group_name: name, category: 'Food', member_count: 3, role })

const renderCollection = () =>
  render(
    <SessionContext.Provider value={{ user: { user_id: 5, is_host: true }, needsOnboarding: false, loading: false, signOut: vi.fn(), refresh: vi.fn() }}>
      <MemoryRouter>
        <MyCollection />
      </MemoryRouter>
    </SessionContext.Provider>,
  )

beforeEach(() => {
  for (const fn of Object.values(UsersAPI)) fn.mockReset()
  UsersAPI.getUserEvents.mockResolvedValue([event(1, 'Jazz Night', 'attending'), event(2, 'Code Day', 'created')])
  UsersAPI.getUserGroups.mockResolvedValue([group(10, 'Jazz Club', 'member'), group(11, 'Code & Coffee', 'organizer')])
})

describe('MyCollection', () => {
  it('has the title My Collection, a link to edit the profile, and the person\'s own events and groups', async () => {
    renderCollection()

    expect(screen.getByRole('heading', { level: 1, name: 'My Collection' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit my profile' })).toHaveAttribute('href', '/profile')
    expect(await screen.findByRole('heading', { name: 'My events' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'My groups' })).toBeInTheDocument()
    expect(UsersAPI.getUserEvents).toHaveBeenCalledWith(5)
    expect(UsersAPI.getUserGroups).toHaveBeenCalledWith(5)
  })

  it('shows Hosted and Organized first for a host, with the Attending and Joined buttons still there', async () => {
    renderCollection()

    expect(await screen.findByText('Code Day')).toBeInTheDocument()
    expect(screen.getByText('Code & Coffee')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Attending (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Joined (1)' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Attending (1)' }))
    await userEvent.click(screen.getByRole('button', { name: 'Joined (1)' }))

    expect(screen.getByText('Jazz Night')).toBeInTheDocument()
    expect(screen.getByText('Jazz Club')).toBeInTheDocument()
  })
})
