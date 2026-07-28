import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSessionUser } from '../../hooks/useSessionUser'
import AuthAPI from '../../services/AuthAPI'
import Avatar from '../Avatar'
import Crest from '../Crest'
import Skeleton from '../Skeleton'
import ballMark from '../../assets/ball.png'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const menuItems = [
  { label: 'Dashboard', to: '/', end: true, icon: DashboardIcon },
  { label: 'Live Football', to: '/matches', end: false, icon: LiveIcon },
  { label: 'Standings', to: '/leaderboard', end: false, icon: StandingsIcon },
  { label: 'Highlights', to: '/discover', end: false, icon: HighlightsIcon },
]

function DashboardIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="8.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.5" y="8.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="8.5" y="8.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function LiveIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function StandingsIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2.5 13.5v-4M8 13.5v-8M13.5 13.5v-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function HighlightsIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 2.5l9 5.5-9 5.5v-11z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className}>
      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.5 10.5l-2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function SignOutIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6 2.5H3.5v11H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 5l3 3-3 3M12 8H6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const user = useSessionUser()
  const [followedTeams, setFollowedTeams] = useState([])
  const [followsLoading, setFollowsLoading] = useState(true)
  const [followsError, setFollowsError] = useState(null)

  useEffect(() => {
    if (!user?.id) {
      setFollowsLoading(false)
      return
    }
    setFollowsLoading(true)
    setFollowsError(null)
    fetch(`${API_URL}/api/follows/user/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load followed teams')
        return res.json()
      })
      .then(setFollowedTeams)
      .catch((err) => {
        console.error('Failed to load followed teams', err)
        setFollowsError('Could not load followed teams.')
      })
      .finally(() => setFollowsLoading(false))
  }, [user?.id])

  // AuthAPI.logout clears localStorage itself. The server also has to destroy
  // the session — clearing only localStorage left the cookie alive, so the next
  // visit picked the session back up and silently signed you in again.
  const handleSignOut = async () => {
    try {
      await AuthAPI.logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen bg-dashboard">
      <aside className="flex w-[220px] shrink-0 flex-col gap-7 border-r border-dash bg-dash-sidebar p-5">
        <div className="flex items-center gap-2">
          <img src={ballMark} alt="" className="size-7 shrink-0" />
          <p className="whitespace-nowrap text-[18px] font-bold text-white">
            Match<span className="text-primary">L</span>ens
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-dash-input py-2 pl-3 pr-2">
          <SearchIcon className="size-3 shrink-0 text-secondary" />
          <input
            type="text"
            placeholder="Quick Search..."
            className="w-full bg-transparent text-[12px] text-secondary placeholder:text-secondary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase text-secondary">Menu</p>
          <div className="flex flex-col gap-1.5">
            {menuItems.map(({ label, to, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-secondary'
                  }`
                }
              >
                <Icon className="size-4 shrink-0" />
                <p className="text-[13px] font-semibold">{label}</p>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase text-secondary">Followed Teams</p>
          <div className="flex flex-col gap-2.5">
            {followsLoading &&
              [0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-5 shrink-0 rounded" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            {!followsLoading && followsError && (
              <p className="text-[12px] text-dash-live">{followsError}</p>
            )}
            {!followsLoading &&
              !followsError &&
              followedTeams.map((team) => (
                <div key={team.followed_team_id} className="flex items-center gap-3">
                  <Crest compact label={team.team_name} className="size-5 shrink-0 rounded" />
                  <p className="text-[13px] font-medium text-white">{team.team_name}</p>
                </div>
              ))}
            {!followsLoading && !followsError && followedTeams.length === 0 && (
              <p className="text-[12px] text-secondary">No teams followed yet.</p>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-1.5">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 ${
                isActive ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Avatar
              name={user?.username}
              src={user?.profile_image_url}
              className="size-7 shrink-0 rounded-full"
              textClassName="text-[10px]"
            />
            <p className="truncate text-[13px] font-semibold">{user?.username ?? 'Profile'}</p>
          </NavLink>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-secondary hover:bg-white/5 hover:text-white"
          >
            <SignOutIcon className="size-4 shrink-0" />
            <p className="text-[13px] font-semibold">Sign Out</p>
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-dashboard">
        <Outlet />
      </main>
    </div>
  )
}
