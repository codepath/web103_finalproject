function HoldLegend() {
  return (
    <div className="hold-legend">
      {['start', 'hand', 'foot', 'finish'].map((role) => (
        <span key={role}>
          <i className={`legend-dot ${role}`} />
          {role}
        </span>
      ))}
    </div>
  )
}

export default HoldLegend
