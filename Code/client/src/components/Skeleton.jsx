// Shared pulsing placeholder for loading states — pass sizing/shape classes
// via `className` the same way callers size any other block-level element.
export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />
}
