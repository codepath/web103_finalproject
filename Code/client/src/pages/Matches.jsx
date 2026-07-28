import { useEffect, useMemo, useState } from 'react'
import MatchCard from '../components/MatchCard'

const API_URL = import.meta.env.VITE_API_URL ?? ''

// The live API only ever emits LIVE | HT | UPCOMING today. FT is a real
// status the schema supports but no fixture currently carries, so the
// Results tab is an honest empty state rather than a broken filter.
const TABS = [
  { label: 'Live', statuses: ['LIVE', 'HT'] },
  { label: 'Upcoming', statuses: ['UPCOMING'] },
  { label: 'Results', statuses: ['FT'] },
]

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12.5 12.5l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('Live')

  useEffect(() => {
    setLoading(true)
    setError(null)
    const query = selectedDate ? `?date=${selectedDate}` : ''
    fetch(`${API_URL}/api/matches${query}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load matches')
        return res.json()
      })
      .then(setMatches)
      .catch((err) => {
        console.error('Failed to load matches', err)
        setError('Could not load matches. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [selectedDate])

  const activeStatuses = TABS.find((tab) => tab.label === activeTab).statuses
  const filteredMatches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return matches
      .filter((match) => activeStatuses.includes(match.status))
      .filter((match) =>
        term === ''
          ? true
          : [match.home, match.away, match.venue].some((field) => field?.toLowerCase().includes(term)),
      )
  }, [matches, activeStatuses, searchTerm])

  const featuredLiveMatch = matches.find((match) => match.status === 'LIVE' || match.status === 'HT')

  return (
    <div className="flex gap-6 p-6">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1 text-white">Matches</h1>
          <p className="text-[13px] text-secondary">
            Live analytics and deep match insights across the FIFA World Cup 2026.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {TABS.map((tab) => {
              const isActive = tab.label === activeTab
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span className={`text-[14px] ${isActive ? 'font-bold text-primary' : 'font-medium text-secondary'}`}>
                    {tab.label}
                  </span>
                  <span className={`h-[3px] w-6 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-lg border border-dash bg-dash-card px-3 py-2 text-[13px] text-white focus:outline-none"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="text-[12px] font-semibold text-primary"
              >
                All dates
              </button>
            )}
            <div className="flex w-[240px] items-center gap-2 rounded-lg border border-dash bg-dash-card px-4 py-2">
              <SearchIcon className="size-3.5 shrink-0 text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Filter by team or venue..."
                className="w-full bg-transparent text-[13px] text-white placeholder:text-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {loading && <p className="text-[13px] text-secondary">Loading matches…</p>}
        {error && <p className="text-[13px] text-dash-live">{error}</p>}

        {!loading && !error && filteredMatches.length === 0 && (
          <p className="text-[13px] text-secondary">
            No {activeTab.toLowerCase()} matches{selectedDate ? ` on ${selectedDate}` : ''}.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      <aside className="flex w-[280px] shrink-0 flex-col gap-6 rounded-2xl border border-dash bg-dash-sidebar p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-dash-live" />
            <p className="text-[14px] font-bold text-white">Live Match Stats</p>
          </div>
          {featuredLiveMatch && (
            <p className="text-[12px] font-semibold text-primary">
              {featuredLiveMatch.home} vs {featuredLiveMatch.away}
            </p>
          )}
        </div>

        {featuredLiveMatch ? (
          <>
            <div className="relative flex h-[100px] w-full flex-col justify-end overflow-hidden rounded-lg bg-gradient-to-br from-dash-card to-black p-3">
              <p className="text-[14px] font-bold text-white">{featuredLiveMatch.venue}</p>
              <p className="text-[10px] text-primary">
                {featuredLiveMatch.status === 'HT' ? 'Half-time' : `${featuredLiveMatch.minute}' live`}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-dash bg-dashboard p-3">
              <p className="text-[12px] font-bold uppercase text-secondary">Live Analytics Feed</p>
              <p className="text-[11px] text-secondary">
                Per-match shot, possession, and foul data isn't available from the API yet — in progress.
              </p>
            </div>
          </>
        ) : (
          <p className="text-[12px] text-secondary">No live match right now.</p>
        )}

        <div className="h-px w-full bg-dash" />

        <div className="flex flex-col gap-1.5 rounded-lg border border-dash bg-dashboard p-3">
          <p className="text-[12px] font-bold text-secondary">⚡ Model Verdict</p>
          <p className="text-[11px] text-secondary">
            Prediction modeling isn't wired up yet — in progress.
          </p>
        </div>
      </aside>
    </div>
  )
}
