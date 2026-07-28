import { useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { getMockPlayerDetail } from '../mocks/playerDetail'

function StarRating({ rating }) {
  const filled = Math.round(rating / 2)
  return (
    <div className="flex items-center gap-0.5 text-[14px] text-primary">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < filled ? 'text-primary' : 'text-dash'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function PlayerDetail() {
  const { playerId } = useParams()
  const player = getMockPlayerDetail(playerId)

  const statBlocks = [
    { value: player.seasonStats.goals, label: 'Goals' },
    { value: player.seasonStats.assists, label: 'Assists' },
    { value: player.seasonStats.appearances, label: 'Appearances' },
    { value: player.seasonStats.passAccuracy, label: 'Pass Accuracy' },
    { value: player.seasonStats.keyPasses, label: 'Key Passes / 90' },
    { value: player.seasonStats.chancesCreated, label: 'Chances Created' },
  ]

  return (
    <div className="flex gap-6 p-6">
      <div className="flex flex-1 flex-col gap-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-dash-card to-black" />
          <div className="relative flex flex-wrap items-center justify-between gap-6 p-6">
            <div className="flex items-center gap-5">
              <Avatar
                name={player.name}
                className="size-[100px] shrink-0 rounded-full border-2 border-primary"
                textClassName="text-[28px]"
              />
              <div className="flex flex-col gap-1.5">
                <p className="text-[28px] font-extrabold text-white">{player.name}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-primary bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {player.position}
                  </span>
                  <p className="text-[13px] font-bold text-white">
                    {player.club} #{player.clubNumber} · {player.nationalTeam}
                  </p>
                </div>
                <p className="text-[11px] font-medium text-secondary">
                  Age: {player.age} · Born: {player.born} · Height: {player.height} · Preferred Foot:{' '}
                  {player.preferredFoot}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg border-[1.5px] border-primary bg-primary/10 px-4 py-2.5 text-[13px] font-semibold text-primary"
            >
              + Follow Player
            </button>
          </div>
        </div>

        {/* Performance overview */}
        <div className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
          <p className="text-[18px] font-bold text-white">Performance Overview ({player.seasonLabel})</p>
          <div className="flex items-center gap-3">
            {statBlocks.map((stat, index) => (
              <div key={stat.label} className="flex flex-1 items-center gap-3">
                <div className="flex flex-1 flex-col items-center gap-1.5">
                  <p className="text-[24px] font-extrabold text-primary">{stat.value}</p>
                  <p className="text-center text-[11px] font-medium text-secondary">{stat.label}</p>
                </div>
                {index < statBlocks.length - 1 && <div className="h-10 w-px shrink-0 bg-dash" />}
              </div>
            ))}
          </div>
        </div>

        {/* Dual metrics */}
        <div className="flex gap-4">
          <div className="flex flex-1 items-center gap-5 rounded-2xl border border-dash bg-dash-card p-5">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
              <p className="text-[28px] font-extrabold text-primary">{player.matchLensScore}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-[14px] font-bold text-white">MatchLens Score</p>
              <p className="text-[13px] font-medium text-secondary">{player.scoreBlurb}</p>
              <span className="w-fit rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                {player.scoreBadge}
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
            <p className="text-[14px] font-bold text-white">Market Value &amp; Rating</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-secondary">ESTIMATED VALUE</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[24px] font-extrabold text-primary">{player.marketValue}</p>
                  <p className="text-[11px] font-medium text-primary">↑ from {player.marketValuePrevious}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[11px] font-semibold text-secondary">MATCH RATING</p>
                <div className="flex items-center gap-2">
                  <p className="text-[24px] font-extrabold text-white">{player.matchRating}</p>
                  <StarRating rating={player.matchRating} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career history */}
        <div className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
          <p className="text-[18px] font-bold text-white">Career History</p>
          <div className="flex flex-col overflow-hidden rounded-lg border border-dash">
            <div className="flex gap-4 bg-dash-sidebar p-3 text-[11px] font-bold text-secondary">
              <p className="w-20">SEASON</p>
              <p className="flex-1">CLUB</p>
              <p className="w-14 text-right">APPS</p>
              <p className="w-14 text-right">GOALS</p>
              <p className="w-16 text-right">ASSISTS</p>
              <p className="w-16 text-right">RATING</p>
            </div>
            {player.careerHistory.map((row) => (
              <div key={row.season} className="flex items-center gap-4 border-t border-dash p-3 text-[13px]">
                <p className="w-20 font-semibold text-white">{row.season}</p>
                <p className="flex-1 text-white">{row.club}</p>
                <p className="w-14 text-right text-white">{row.apps}</p>
                <p className="w-14 text-right text-white">{row.goals}</p>
                <p className="w-16 text-right text-white">{row.assists}</p>
                <p className="w-16 text-right font-semibold text-primary">{row.rating}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attributes + AI note */}
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-5 rounded-2xl border border-dash bg-dash-card p-5">
            <p className="text-[18px] font-bold text-white">Key Attributes</p>
            <div className="flex flex-col gap-3.5">
              {player.attributes.map((attr) => (
                <div key={attr.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <p className="text-white">{attr.label}</p>
                    <p className="font-semibold text-white">{attr.value}</p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-dash-input">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${attr.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
            <p className="flex items-center gap-2 text-[14px] font-bold text-white">
              <span className="text-primary">✨</span> AI Tactical Analysis
            </p>
            <p className="text-[13px] leading-relaxed text-secondary">{player.aiNote}</p>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="flex w-[280px] shrink-0 flex-col gap-5 rounded-2xl border border-dash bg-dash-sidebar p-5">
        <p className="text-[18px] font-bold text-white">World Cup 2026 Profile</p>

        <div className="flex flex-col gap-3 rounded-xl border border-dash bg-dash-card p-4">
          <p className="text-[11px] font-bold uppercase text-secondary">{player.groupLabel}</p>
          <div className="flex flex-col gap-2">
            {player.groupStandings.map((row) => (
              <div key={row.name} className="flex items-center justify-between text-[13px]">
                <p className="text-white">{row.name}</p>
                <p className="font-semibold text-white">{row.points} PTS</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-dash bg-dash-card p-4">
          <p className="text-[13px] font-bold text-white">International Record</p>
          <div className="flex flex-col gap-2 text-[13px]">
            <div className="flex items-center justify-between">
              <p className="text-secondary">Caps</p>
              <p className="font-semibold text-white">{player.internationalRecord.caps}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-secondary">Goals</p>
              <p className="font-semibold text-white">{player.internationalRecord.goals}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-secondary">Assists</p>
              <p className="font-semibold text-white">{player.internationalRecord.assists}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
