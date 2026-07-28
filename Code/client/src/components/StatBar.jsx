export default function StatBar({ label, homeValue, awayValue }) {
  const total = homeValue + awayValue
  const homePercent = total > 0 ? (homeValue / total) * 100 : 50
  const awayPercent = 100 - homePercent

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-start justify-between whitespace-nowrap">
        <p className="text-[12px] text-white">{homeValue}</p>
        <p className="text-[11px] font-semibold text-secondary">{label}</p>
        <p className="text-[12px] text-primary">{awayValue}</p>
      </div>
      <div className="flex w-full items-start gap-1">
        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${homePercent}%` }} />
        <div className="h-1.5 rounded-full bg-dash-input" style={{ width: `${awayPercent}%` }} />
      </div>
    </div>
  )
}
