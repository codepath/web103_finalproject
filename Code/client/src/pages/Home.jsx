import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MatchCard from '../components/MatchCard'
import PlayerCard from '../components/PlayerCard'
import StandingsTable from '../components/StandingsTable'
import StatBar from '../components/StatBar'
import Crest from '../components/Crest'
import Skeleton from '../components/Skeleton'
import { useSessionUser } from '../hooks/useSessionUser'
import { knockoutBracket, matchStatistics } from '../mocks/dashboardMocks'

// Falls back to a relative path (same-origin) when unset, so requests
// still work via the Vite proxy in dev and the Express static server in
// prod without ever hardcoding a host.
const API_URL = import.meta.env.VITE_API_URL ?? ''

function getCountdown(dateString, now) {
  const diff = Math.max(0, new Date(dateString).getTime() - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex w-12 flex-col items-center">
      <p className="text-[18px] font-bold text-white">{String(value).padStart(2, '0')}</p>
      <p className="text-[9px] text-secondary">{label}</p>
    </div>
  )
}

function BracketMatch({ home, away, highlight }) {
  return (
    <div
      className={`flex w-[120px] flex-col gap-1 rounded-md p-2 text-[11px] ${
        highlight ? 'border border-primary bg-primary/10' : 'bg-dash-sidebar'
      }`}
    >
      <p className={`font-semibold ${highlight ? 'text-primary' : 'text-white'}`}>{home}</p>
      <p className={highlight ? 'text-white' : 'text-secondary'}>{away}</p>
    </div>
  )
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request to ${url} failed`)
  return res.json()
}

export default function Home() {
  const sessionUser = useSessionUser()
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [topScorers, setTopScorers] = useState([])
  const [user, setUser] = useState(null)
  const [now, setNow] = useState(Date.now())

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetchJson(`${API_URL}/api/matches`),
      fetchJson(`${API_URL}/api/teams`),
      fetchJson(`${API_URL}/api/players?sort=goals`),
    ])
      .then(([matchesData, teamsData, playersData]) => {
        if (cancelled) return
        setMatches(matchesData)
        setTeams(teamsData)
        setTopScorers(playersData.slice(0, 3))
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to load dashboard data', err)
        setError('Could not load dashboard data. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!sessionUser?.id) return
    fetchJson(`${API_URL}/api/users/${sessionUser.id}`)
      .then(setUser)
      .catch((err) => console.error('Failed to load user', err))
  }, [sessionUser?.id])

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const upcomingMatch = matches.find((m) => m.status === 'UPCOMING')
  const liveMatch = matches.find((m) => m.status === 'LIVE' || m.status === 'HT')
  const countdown = upcomingMatch ? getCountdown(upcomingMatch.date, now) : null

  if (error) {
    return (
      <div className="p-6">
        <p className="text-[13px] text-dash-live">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6 p-6">
      <div className="flex flex-1 flex-col gap-6">
        {/* Hero */}
        {loading ? (
          <Skeleton className="h-[136px] w-full rounded-2xl" />
        ) : (
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-dash-card to-black" />
            <div className="relative flex flex-wrap items-center justify-between gap-6 p-6">
              <div className="flex max-w-[400px] flex-col gap-2">
                <span className="inline-flex w-fit items-center rounded bg-dash-live px-2 py-1 text-[10px] font-bold text-white">
                  {upcomingMatch ? 'UPCOMING MAJOR' : 'NO UPCOMING MATCH'}
                </span>
                {upcomingMatch ? (
                  <>
                    <h1 className="text-[24px] font-extrabold text-white">
                      {upcomingMatch.home} vs {upcomingMatch.away}
                    </h1>
                    <p className="text-[13px] text-primary">
                      {new Date(upcomingMatch.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      • {upcomingMatch.venue}
                    </p>
                  </>
                ) : (
                  <p className="text-[13px] text-secondary">Check back soon for the next fixture.</p>
                )}
              </div>
              {upcomingMatch && countdown && (
                <div className="flex items-center gap-3 rounded-xl bg-black/30 p-3">
                  <TimeUnit value={countdown.days} label="Days" />
                  <span className="text-[14px] text-secondary">:</span>
                  <TimeUnit value={countdown.hours} label="Hours" />
                  <span className="text-[14px] text-secondary">:</span>
                  <TimeUnit value={countdown.minutes} label="Min" />
                  <span className="text-[14px] text-secondary">:</span>
                  <TimeUnit value={countdown.seconds} label="Sec" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Match ticker */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-6 text-[13px]">
              <p className="text-white">Latest Match</p>
              <p className="text-secondary">Coming Match</p>
              <p className="text-secondary">Pre-season</p>
              <p className="text-secondary">Live Games</p>
            </div>
            <p className="text-[11px] font-bold text-primary">SEE ALL</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[124px] w-full rounded-xl" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <p className="text-[13px] text-secondary">No matches scheduled right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>

        {/* Knockout bracket */}
        <section className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
          <h2 className="text-[16px] font-bold text-white">🏆 World Cup 2026 Knockout Bracket</h2>
          <div className="flex items-center justify-between gap-4 overflow-x-auto py-2">
            <div className="flex flex-col gap-6">
              {knockoutBracket.quarterLeft.map((m, i) => (
                <BracketMatch key={i} home={m.home} away={m.away} />
              ))}
            </div>
            <div className="h-px w-8 shrink-0 bg-dash" />
            <BracketMatch home={knockoutBracket.semiLeft.home} away={knockoutBracket.semiLeft.away} highlight />
            <div className="flex shrink-0 flex-col items-center gap-3">
              <p className="text-[10px] font-bold uppercase text-primary">Grand Final</p>
              <div className="flex w-[160px] flex-col items-center gap-2 rounded-lg border-2 border-primary bg-black p-3 text-center">
                <p className="text-[12px] font-bold text-white">
                  {knockoutBracket.final.home} vs {knockoutBracket.final.away}
                </p>
                <p className="text-[10px] text-secondary">{knockoutBracket.final.venue}</p>
              </div>
            </div>
            <BracketMatch home={knockoutBracket.semiRight.home} away={knockoutBracket.semiRight.away} highlight />
            <div className="h-px w-8 shrink-0 bg-dash" />
            <div className="flex flex-col gap-6">
              {knockoutBracket.quarterRight.map((m, i) => (
                <BracketMatch key={i} home={m.home} away={m.away} />
              ))}
            </div>
          </div>
        </section>

        {/* Standings */}
        <section className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-white">🔥 Standings</h2>
            <p className="text-[12px] font-semibold text-secondary">MATCHDAY 24</p>
          </div>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <p className="text-[13px] text-secondary">No standings available right now.</p>
          ) : (
            <StandingsTable teams={teams} />
          )}
        </section>

        {/* Top scorers */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[16px] font-bold text-white">⚽ Top Scorers</h2>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
              ))}
            </div>
          ) : topScorers.length === 0 ? (
            <p className="text-[13px] text-secondary">No player stats available right now.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {topScorers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Live match widget */}
      <aside className="flex w-[280px] shrink-0 flex-col gap-6 rounded-2xl border border-dash bg-dash-sidebar p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-dash-live" />
            <p className="text-[14px] font-bold text-white">Live Match</p>
          </div>
          {liveMatch && (
            <p className="text-[12px] font-semibold text-primary">
              {liveMatch.status === 'HT' ? 'HT' : `${liveMatch.minute}'`}
            </p>
          )}
        </div>

        {loading ? (
          <Skeleton className="h-[92px] w-full rounded-xl" />
        ) : liveMatch ? (
          <>
            <div className="flex items-center justify-center gap-4 rounded-xl border border-dash bg-dashboard p-3">
              <div className="flex flex-col items-center gap-1.5">
                <Crest label={liveMatch.home} className="size-9 rounded-full" textClassName="text-[11px]" />
                <p className="text-[11px] font-semibold text-white">{liveMatch.home}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[24px] font-extrabold text-primary">
                  {liveMatch.home_score} - {liveMatch.away_score}
                </p>
                <p className="text-[10px] text-secondary">{liveMatch.venue}</p>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Crest label={liveMatch.away} className="size-9 rounded-full" textClassName="text-[11px]" />
                <p className="text-[11px] font-semibold text-white">{liveMatch.away}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[12px] font-bold uppercase text-secondary">Match Statistics</p>
              {matchStatistics.map((stat) => (
                <StatBar key={stat.label} {...stat} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-[12px] text-secondary">No live match right now.</p>
        )}

        <div className="h-px w-full bg-dash" />

        <div className="flex flex-col gap-2 rounded-xl border border-primary bg-primary/10 p-4">
          <p className="text-[13px] font-bold text-primary">⚡ Leaderboard Surge</p>
          <p className="text-[12px] text-white">Your predictions are paying off. Top 5% this week.</p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-dash bg-dashboard p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-secondary">Points</p>
            <p className="text-[16px] font-extrabold text-primary">
              {(user?.points ?? 0).toLocaleString()}
            </p>
          </div>
        </div>

        <Link
          to="/leaderboard"
          className="flex items-center justify-center rounded-lg bg-primary p-3.5 text-[13px] font-bold text-black"
        >
          ENTER LEADERBOARD
        </Link>
      </aside>
    </div>
  )
}
