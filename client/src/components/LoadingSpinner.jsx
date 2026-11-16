export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="lb-loading" role="status" aria-live="polite">
      <span className="lb-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
