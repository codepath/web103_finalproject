import { useEffect, useState } from 'react'
import TeamCard from '../components/TeamCard'
import { useSessionUser } from '../hooks/useSessionUser'
import { useTeamSearch } from '../hooks/useTeamSearch'
import { teams } from '../mocks/teams'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const TRENDING_TAGS = ['Lionel Messi', 'Kylian Mbappé', 'World Cup 2026', 'Argentina', 'France']

const GROUP_TABS = [
  { label: 'All', value: 'All' },
  { label: 'Group A', value: 'A' },
  { label: 'Group B', value: 'B' },
  { label: 'Group C', value: 'C' },
  { label: 'Group D', value: 'D' },
  { label: 'Group E', value: 'E' },
  { label: 'Group F', value: 'F' },
]

const FOOTER_COLUMNS = [
  { title: 'Explore', links: ['Live Matches', 'Standings', 'Highlights', 'Predictions'] },
  { title: 'Stats', links: ['Player Stats', 'Team Stats', 'Group Standings', 'Head-to-Head Nations'] },
  { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQ', 'Feedback'] },
  { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Data Sources', 'API Access'] },
]

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function Discover() {
  const sessionUser = useSessionUser()
  const userId = sessionUser?.id

  const { searchTerm, setSearchTerm, activeGroup, setActiveGroup, filteredTeams } = useTeamSearch(teams)
  const [followedTeams, setFollowedTeams] = useState([])
  const [followsLoading, setFollowsLoading] = useState(true)
  const [followsLoadError, setFollowsLoadError] = useState(null)
  const [followError, setFollowError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setFollowsLoading(false)
      return
    }
    setFollowsLoading(true)
    setFollowsLoadError(null)
    fetch(`${API_URL}/api/follows/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load followed teams')
        return res.json()
      })
      .then(setFollowedTeams)
      .catch((err) => {
        console.error('Failed to load followed teams', err)
        setFollowsLoadError('Could not load your followed teams — follow status may be out of date.')
      })
      .finally(() => setFollowsLoading(false))
  }, [userId])

  async function handleToggleFollow(team) {
    setFollowError(null)
    const existing = followedTeams.find((f) => String(f.api_team_id) === String(team.api_team_id))
    try {
      if (existing) {
        const res = await fetch(`${API_URL}/api/follows/${existing.followed_team_id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Unfollow failed')
        setFollowedTeams((prev) => prev.filter((f) => f.followed_team_id !== existing.followed_team_id))
      } else {
        const res = await fetch(`${API_URL}/api/follows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, api_team_id: team.api_team_id, team_name: team.name }),
        })
        if (!res.ok) throw new Error('Follow failed')
        const created = await res.json()
        setFollowedTeams((prev) => [...prev, created])
      }
    } catch (err) {
      setFollowError('Could not update follow status. Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Featured banner */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-dash-card to-black" />
        <div className="relative flex flex-col gap-2 p-6">
          <span className="w-fit rounded bg-primary px-2 py-1 text-[10px] font-bold text-dash-sidebar">
            DISCOVER THE WORLD CUP
          </span>
          <h1 className="text-[28px] font-extrabold text-white">Explore the World Cup 2026</h1>
          <p className="text-[13px] font-medium text-primary">
            Find and follow national teams and players competing in the FIFA World Cup 2026.
          </p>
        </div>
      </div>

      {/* Search and trending */}
      <div className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
        <div className="flex items-center gap-3 rounded-lg border border-dash bg-dashboard px-4 py-3">
          <SearchIcon className="size-4 shrink-0 text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search teams, players, leagues..."
            className="w-full bg-transparent text-[13px] font-medium text-white placeholder:text-secondary focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[11px] font-semibold text-secondary">Trending:</p>
          {TRENDING_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-dash bg-dash-sidebar px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Filter by group */}
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-white">Filter by League</p>
        <div className="flex flex-wrap gap-2.5">
          {GROUP_TABS.map((tab) => {
            const isActive = tab.value === activeGroup
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveGroup(tab.value)}
                className={`rounded-lg border border-dash px-[18px] py-2.5 text-[13px] font-bold ${
                  isActive ? 'bg-primary text-dash-sidebar' : 'bg-dash-card text-white'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Team grid */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold text-white">Top Featured Teams</p>
          <p className="text-[13px] font-semibold text-primary">SEE ALL</p>
        </div>
        {followsLoadError && <p className="text-[12px] text-dash-live">{followsLoadError}</p>}
        {followError && <p className="text-[12px] text-dash-live">{followError}</p>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.api_team_id}
              team={team}
              isFollowing={followedTeams.some((f) => String(f.api_team_id) === String(team.api_team_id))}
              onToggleFollow={() => handleToggleFollow(team)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-6 rounded-2xl border border-dash bg-dash-card p-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase text-secondary">{column.title}</p>
              <div className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <p key={link} className="text-[13px] text-white">
                    {link}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="h-px w-full bg-dash" />
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-bold text-white">
            Match<span className="text-primary">L</span>ens
          </p>
          <p className="text-[13px] text-secondary">© 2026 MatchLens Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
