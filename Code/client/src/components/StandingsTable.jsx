import { Link } from 'react-router-dom'
import Crest from './Crest'

function LeaderboardTable({ rows }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-dash">
      <div className="flex gap-4 bg-dash-sidebar p-3 text-[11px] font-bold text-secondary">
        <p className="w-[60px]">RANK</p>
        <p className="flex-1">USERNAME</p>
        <p className="w-[140px]">LOCATION / TITLE</p>
        <p className="w-[110px] text-right">POINTS</p>
        <p className="w-[140px]">TOP TEAM</p>
        <p className="w-[60px] text-center">TREND</p>
      </div>
      {rows.map((row) => {
        const isTopThree = row.rank <= 3
        return (
          <div
            key={row.rank}
            className={`flex items-center gap-4 border-t border-dash p-3 ${
              row.rank === 1 ? 'bg-dash-gold/5' : ''
            }`}
          >
            <div className="flex w-[60px] items-center gap-1">
              {isTopThree && <span className="text-[13px]">🏅</span>}
              <p className={`text-[13px] font-bold ${isTopThree ? 'text-dash-gold' : 'text-white'}`}>{row.rank}</p>
            </div>
            <p className="flex-1 truncate text-[13px] font-semibold text-white">{row.username}</p>
            <div className="flex w-[140px] flex-col gap-0.5">
              <p className="truncate text-[12px] font-medium text-white">{row.location}</p>
              <p className="truncate text-[10px] text-secondary">{row.title}</p>
            </div>
            <p className="w-[110px] text-right text-[13px] font-bold text-primary">
              {row.points.toLocaleString()}
            </p>
            <div className="flex w-[140px] items-center gap-1.5">
              <Crest compact label={row.topTeam} className="h-3 w-[18px] shrink-0 rounded-sm" />
              <p className="truncate text-[12px] text-white">{row.topTeam}</p>
            </div>
            <div className="flex w-[60px] items-center justify-center text-[14px]">
              {row.trend === 'up' ? (
                <span className="text-primary">▲</span>
              ) : (
                <span className="text-dash-live">▼</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function StandingsTable({ teams, variant = 'teams', rows }) {
  if (variant === 'leaderboard') {
    return <LeaderboardTable rows={rows} />
  }

  const sorted = [...teams].sort((a, b) => b.points - a.points)

  return (
    <div className="w-full">
      <div className="flex gap-4 rounded-t-lg bg-dash-sidebar p-3 text-[11px] font-bold text-secondary">
        <p className="w-10">RANK</p>
        <p className="flex-1">TEAM</p>
        <p className="w-10 text-center">W</p>
        <p className="w-10 text-center">D</p>
        <p className="w-10 text-center">L</p>
        <p className="w-[60px] text-right">PTS</p>
      </div>
      {sorted.map((team, index) => {
        const rank = index + 1
        const isFirst = rank === 1
        return (
          <div
            key={team.id}
            className={`flex items-center gap-4 border border-dash p-3 ${
              isFirst ? 'bg-primary/[0.06]' : ''
            }`}
          >
            <p className={`w-10 text-[13px] font-bold ${isFirst ? 'text-primary' : 'text-white'}`}>
              {rank}
            </p>
            <Link to={`/teams/${team.id}`} className="flex flex-1 items-center gap-3">
              <Crest label={team.name} className="size-6 rounded-full" textClassName="text-[9px]" />
              <p className="text-[13px] font-semibold text-white">{team.name}</p>
            </Link>
            <p className="w-10 text-center text-[13px] text-white">{team.wins}</p>
            <p className="w-10 text-center text-[13px] text-white">{team.draws}</p>
            <p className="w-10 text-center text-[13px] text-white">{team.losses}</p>
            <p className={`w-[60px] text-right text-[13px] font-bold ${isFirst ? 'text-primary' : 'text-white'}`}>
              {team.points}
            </p>
          </div>
        )
      })}
    </div>
  )
}
