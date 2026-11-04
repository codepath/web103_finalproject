function ClimbingWall({ holds = [], interactive = false, compact = false, onHoldClick }) {
  const cells = Array.from({ length: 16 * 12 })

  return (
    <div className={`climbing-wall ${compact ? 'compact' : ''} ${interactive ? 'interactive' : ''}`}>
      {cells.map((_, index) => {
        const row = Math.floor(index / 12)
        const col = index % 12
        const hold = holds.find((item) => item.row === row && item.col === col)

        return (
          <button
            className={`wall-cell ${hold ? `hold-${hold.role}` : ''}`}
            key={`${row}-${col}`}
            onClick={() => onHoldClick?.(row, col)}
            type="button"
            aria-label={hold ? `${hold.role} hold at row ${row}, column ${col}` : `Empty wall position ${row}, ${col}`}
          >
            {hold && <span className="hold-dot" style={{ backgroundColor: hold.color }} />}
          </button>
        )
      })}
    </div>
  )
}

export default ClimbingWall
