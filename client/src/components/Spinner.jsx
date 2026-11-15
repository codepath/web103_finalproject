export default function Spinner({ label = 'Loading…', inline = false }) {
  if (inline) return <span className="spinner spinner-small" aria-hidden="true" />
  return (
    <div className="loading-state" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
