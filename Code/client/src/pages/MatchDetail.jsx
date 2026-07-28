import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import CommentThread from '../components/CommentThread'
import Crest from '../components/Crest'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const TABS = ['Overview', 'Lineup', 'Stats', 'Comments', 'Highlights']

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function InProgress({ label }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-dash bg-dash-card p-5">
      <p className="text-[13px] font-semibold text-secondary">{label} isn't available from the API yet.</p>
      <p className="text-[12px] text-secondary">This section is in progress.</p>
    </div>
  )
}

export default function MatchDetail() {
  const { matchId } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setError(null)
    fetch(`${API_URL}/api/matches/${matchId}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true)
          return null
        }
        if (!res.ok) throw new Error('Failed to load match')
        return res.json()
      })
      .then((data) => data && setMatch(data))
      .catch((err) => {
        console.error('Failed to load match', err)
        setError('Could not load this match. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [matchId])

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-[13px] text-secondary">Loading match…</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-start gap-3 p-6">
        <p className="text-[16px] font-bold text-white">Match not found</p>
        <p className="text-[13px] text-secondary">This match doesn't exist or may have been removed.</p>
        <Link to="/matches" className="text-[13px] font-semibold text-primary">
          ← Back to Matches
        </Link>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="p-6">
        <p className="text-[13px] text-dash-live">{error ?? 'Something went wrong.'}</p>
      </div>
    )
  }

  const isLiveOrHt = match.status === 'LIVE' || match.status === 'HT'

  return (
    <div className="flex gap-6 p-6">
      <div className="flex flex-1 flex-col gap-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-dash-card to-black" />
          <div className="relative flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold text-secondary">{formatDate(match.date)} • {match.venue}</p>
              {isLiveOrHt && (
                <span className="rounded border border-primary bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                  {match.status === 'HT' ? 'HALF-TIME' : `LIVE ${match.minute}'`}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between px-10">
              <div className="flex w-[180px] items-center gap-3">
                <p className="truncate text-[22px] font-extrabold text-white">{match.home}</p>
                <Crest compact label={match.home} className="size-4 rounded-full" />
              </div>
              <div className="shrink-0 rounded-lg bg-dash-sidebar px-4 py-1.5">
                <p className="text-[32px] font-extrabold text-primary">
                  {match.home_score ?? '–'} - {match.away_score ?? '–'}
                </p>
              </div>
              <div className="flex w-[180px] items-center justify-end gap-3">
                <Crest compact label={match.away} className="size-4 rounded-full" />
                <p className="truncate text-[22px] font-extrabold text-white">{match.away}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-dash">
          {TABS.map((tab) => {
            const isActive = tab === activeTab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex flex-col items-center gap-1.5 pb-2"
              >
                <span className={`text-[14px] ${isActive ? 'font-bold text-primary' : 'font-medium text-secondary'}`}>
                  {tab}
                </span>
                <span className={`h-[3px] w-10 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'Overview' && <InProgress label="Key match events" />}
        {activeTab === 'Lineup' && <InProgress label="Tactical formations and lineups" />}
        {activeTab === 'Stats' && <InProgress label="Match statistics and possession" />}
        {activeTab === 'Comments' && <CommentThread />}
        {activeTab === 'Highlights' && <VideoPlayer title={`${match.home} vs ${match.away} — Highlights`} />}
      </div>

      {/* Right sidebar */}
      <aside className="flex w-[300px] shrink-0 flex-col gap-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-dash bg-dash-card p-4">
          <p className="text-[16px] font-bold text-white">💬 Live Fan Chat</p>
          <p className="text-[12px] text-secondary">Live chat isn't available from the API yet — in progress.</p>
        </div>

        <button
          type="button"
          disabled
          title="Predictions aren't available yet"
          className="flex cursor-not-allowed items-center justify-center rounded-lg bg-dash-neutral p-3.5 text-[13px] font-bold text-secondary"
        >
          PLACE WAGER — COMING SOON
        </button>
      </aside>
    </div>
  )
}
