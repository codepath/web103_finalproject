import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PlayerCard from '../components/PlayerCard'
import Crest from '../components/Crest'
import { getMockTeamDetail } from '../mocks/teamDetail'

export default function TeamDetail() {
  const { teamId } = useParams()
  const team = getMockTeamDetail(teamId)
  const [isFollowing, setIsFollowing] = useState(team.isFollowing)

  return (
    <div className="flex gap-6 p-6">
      <div className="flex flex-1 flex-col gap-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-dash-card to-black" />
          <div className="relative flex flex-wrap items-center justify-between gap-6 p-6">
            <div className="flex items-center gap-5">
              <Crest label={team.name} className="size-20 rounded-full" textClassName="text-[26px]" />
              <div className="flex flex-col gap-1.5">
                <p className="text-[28px] font-extrabold text-white">{team.name}</p>
                <p className="text-[11px] font-bold text-primary">{team.tagline}</p>
                <p className="text-[11px] font-medium text-secondary">{team.meta}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFollowing((prev) => !prev)}
              className={`shrink-0 rounded-lg border-[1.5px] border-primary px-4 py-2.5 text-[13px] font-semibold ${
                isFollowing ? 'bg-primary/10 text-primary' : 'bg-transparent text-white'
              }`}
            >
              {isFollowing ? '✓ Following Team' : '+ Follow Team'}
            </button>
          </div>
        </div>

        {/* Recent form + metrics */}
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
            <p className="text-[18px] font-bold text-white">Recent Form</p>
            <div className="flex items-center gap-3">
              {team.recentForm.map((entry, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      entry.result === 'W' ? 'bg-primary text-dash-sidebar' : 'bg-dash-live text-white'
                    }`}
                  >
                    {entry.result}
                  </div>
                  <p className="text-[10px] text-secondary">{entry.score}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
            <p className="text-[18px] font-bold text-white">Tournament Metrics</p>
            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex items-center justify-between">
                <p className="font-medium text-secondary">Goal Difference</p>
                <p className="font-semibold text-primary">{team.metrics.goalDifference}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-secondary">Goals Scored</p>
                <p className="font-semibold text-white">{team.metrics.goalsScored}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-secondary">Goals Conceded</p>
                <p className="font-semibold text-white">{team.metrics.goalsConceded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming fixtures */}
        <div className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
          <p className="text-[18px] font-bold text-white">Upcoming Fixtures</p>
          <div className="flex flex-col">
            {team.upcomingFixtures.map((fixture, index) => (
              <div key={index} className="flex items-center gap-4 border-b border-dash py-3 last:border-b-0">
                <div className="flex w-20 shrink-0 flex-col gap-0.5">
                  <p className="text-[11px] font-bold text-primary">{fixture.date}</p>
                  <p className="text-[11px] font-medium text-secondary">{fixture.time}</p>
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex flex-1 items-center justify-end gap-1.5">
                    <p className="truncate text-[13px] font-semibold text-white">{fixture.homeTeam}</p>
                    <Crest compact label={fixture.homeTeam} className="size-4 rounded-sm" />
                  </div>
                  <p className="shrink-0 text-[11px] font-bold text-secondary">vs</p>
                  <div className="flex flex-1 items-center gap-1.5">
                    <Crest compact label={fixture.awayTeam} className="size-4 rounded-sm" />
                    <p className="truncate text-[13px] font-semibold text-white">{fixture.awayTeam}</p>
                  </div>
                </div>
                <p className="w-[140px] shrink-0 truncate text-right text-[11px] font-medium text-secondary">
                  {fixture.venue}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] font-bold uppercase text-primary">VIEW FULL SCHEDULE →</p>
        </div>

        {/* Squad highlights */}
        <div className="flex flex-col gap-4">
          <p className="text-[18px] font-bold text-white">Squad Highlights</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {team.roster.map((player) => (
              <PlayerCard key={player.id} player={{ ...player, team: team.name }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="flex w-[280px] shrink-0 flex-col gap-6 rounded-2xl border border-dash bg-dash-sidebar p-5">
        <p className="text-[15px] font-bold text-white">{team.groupLabel}</p>
        <div className="flex flex-col overflow-hidden rounded-xl border border-dash bg-dash-card text-[11px]">
          <div className="flex gap-2 bg-dashboard p-2.5 font-bold text-secondary">
            <p className="w-[30px]">POS</p>
            <p className="flex-1">TEAM</p>
            <p className="w-10 text-right">PTS</p>
          </div>
          {team.standings.map((row) => {
            const isCurrentTeam = row.name === team.name
            return (
              <div
                key={row.rank}
                className={`flex items-center gap-2 p-2.5 ${isCurrentTeam ? 'bg-primary/10' : ''}`}
              >
                <p className={`w-[30px] font-bold ${isCurrentTeam ? 'text-primary' : 'text-white'}`}>{row.rank}</p>
                <p className="flex-1 truncate font-medium text-white">{row.name}</p>
                <p className={`w-10 text-right font-bold ${isCurrentTeam ? 'text-primary' : 'text-white'}`}>
                  {row.points}
                </p>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-primary bg-primary/10 p-4 text-[11px]">
          <p className="font-bold text-primary">⚡ Tournament Favorites</p>
          <p className="text-white">
            {team.name} has a 22% projected model chance of winning the FIFA World Cup 2026, the highest of any
            nation in the tournament.
          </p>
        </div>
      </aside>
    </div>
  )
}
