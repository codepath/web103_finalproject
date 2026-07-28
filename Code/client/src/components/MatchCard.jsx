import { Link } from 'react-router-dom'
import Crest from './Crest'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function MatchCard({ match }) {
  const { id, home, away, home_score, away_score, status, minute, date } = match
  const isLive = status === 'LIVE'

  return (
    <Link
      to={`/matches/${id}`}
      className="flex flex-col gap-3 rounded-xl border border-dash bg-dash-card p-3"
    >
      <div className="flex items-start justify-between text-overline whitespace-nowrap">
        <p className="font-semibold text-secondary">{formatDate(date)}</p>
        <p className={isLive ? 'font-bold text-primary' : 'font-bold text-secondary'}>
          {isLive && minute != null ? `LIVE ${minute}'` : status}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Crest compact label={home} className="size-4 rounded-sm" />
          <p className="flex-1 truncate text-[12px] font-semibold text-white">{home}</p>
        </div>
        <div className="flex w-full items-center justify-center rounded-md bg-dash-sidebar px-2 py-1">
          <p className="text-[14px] font-bold text-primary">
            {home_score ?? '–'} - {away_score ?? '–'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Crest compact label={away} className="size-4 rounded-sm" />
          <p className="flex-1 truncate text-[12px] font-semibold text-white">{away}</p>
        </div>
      </div>
    </Link>
  )
}
