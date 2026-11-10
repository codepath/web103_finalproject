// Reusable 2D climbing wall: a 12 x 16 grid of T-nut bolt holes.
// Row 0 is the top of the wall, row 15 is the floor.
const ROWS = 16
const COLS = 12
const ROLES = ['start', 'hand', 'foot', 'finish']

// Typical angle (degrees past vertical) for each wall type when a route has no exact angle.
// Negative leans away from the climber (slab), positive leans over them (overhang/roof).
// Matches the ranges in server/data/WallTypes.js.
const DEFAULT_ANGLES = { slab: -10, vertical: 0, overhang: 30, roof: 70 }

// Side view of the wall: floor line, dashed vertical reference, and the wall tilted to `angle`.
// The climber stands on the right, so overhangs lean right.
function WallProfile({ wallType, angle }) {
  const radians = (Math.max(-90, Math.min(90, angle)) * Math.PI) / 180
  const baseX = 14
  const baseY = 32
  const length = 26
  const topX = baseX + length * Math.sin(radians)
  const topY = baseY - length * Math.cos(radians)
  const name = wallType.charAt(0).toUpperCase() + wallType.slice(1).toLowerCase()

  return (
    <div className="wall-profile" aria-label={`${name} wall, ${angle} degrees`} role="img">
      <svg viewBox="0 0 44 36" aria-hidden="true">
        <line className="wall-profile-floor" x1="4" y1={baseY} x2="40" y2={baseY} />
        <line className="wall-profile-ref" x1={baseX} y1={baseY} x2={baseX} y2={baseY - length} />
        <line className="wall-profile-wall" x1={baseX} y1={baseY} x2={topX} y2={topY} />
      </svg>
      <span>{name} · {angle}°</span>
    </div>
  )
}

function WallComponent({ holds = [], editable = false, size = 'md', wallType, angle, onCellClick, onPlacedHoldClick }) {
  const holdsByCell = new Map(holds.map((hold) => [`${hold.row}-${hold.col}`, hold]))
  const profileAngle = angle ?? DEFAULT_ANGLES[wallType?.toLowerCase()]

  return (
    <div className={`wall-frame wall-frame-${size}`}>
      {wallType && profileAngle !== undefined && <WallProfile wallType={wallType} angle={profileAngle} />}
      <div className={`wall wall-${size}${editable ? ' wall-editable' : ''}`}>
      {Array.from({ length: ROWS * COLS }, (_, index) => {
        const row = Math.floor(index / COLS)
        const col = index % COLS
        const key = `${row}-${col}`
        const hold = holdsByCell.get(key)

        if (hold) {
          const role = ROLES.includes(hold.role) ? hold.role : 'any'
          const image = (
            <img
              className={`wall-hold role-${role}`}
              src={hold.imageUrl}
              alt=""
              draggable={false}
              style={{ transform: `rotate(${hold.rotation ?? 0}deg)` }}
            />
          )
          const label = `${hold.role} hold at row ${row}, column ${col}`

          return editable ? (
            <button className="wall-cell" key={key} type="button" aria-label={label} onClick={() => onPlacedHoldClick?.(hold)}>
              {image}
            </button>
          ) : (
            <div className="wall-cell" key={key} role="img" aria-label={label}>
              {image}
            </div>
          )
        }

        return editable ? (
          <button
            className="wall-cell"
            key={key}
            type="button"
            aria-label={`Empty bolt hole at row ${row}, column ${col}`}
            onClick={() => onCellClick?.(row, col)}
          >
            <span className="wall-bolt" />
          </button>
        ) : (
          <div className="wall-cell" key={key}>
            <span className="wall-bolt" />
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default WallComponent
