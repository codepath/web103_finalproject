import { Link } from 'react-router-dom'
import Avatar from './Avatar'

export default function PlayerCard({ player }) {
  const { id, name, team, position, goals, assists } = player

  return (
    <Link
      to={`/players/${id}`}
      className="flex flex-col gap-3 rounded-xl border border-dash bg-dash-card p-4"
    >
      <Avatar name={name} className="h-[130px] w-full rounded-lg" textClassName="text-[28px]" />
      <div className="flex flex-col gap-1">
        <p className="text-caption font-bold uppercase text-primary">{team}</p>
        <p className="text-body-lg font-bold text-white">{name}</p>
        <p className="line-clamp-2 text-caption text-secondary">
          {position} • {assists} assists
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-dash pt-2">
        <p className="text-caption text-secondary">Goals:</p>
        <p className="text-[16px] font-extrabold text-white">{goals}</p>
      </div>
    </Link>
  )
}
