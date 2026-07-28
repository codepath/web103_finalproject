import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-dashboard p-6 text-center">
      <p className="text-[13px] font-bold uppercase tracking-wide text-primary">404</p>
      <h1 className="text-[28px] font-extrabold text-white">Page not found</h1>
      <p className="max-w-sm text-[13px] text-secondary">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="rounded-lg bg-primary px-4 py-2.5 text-[13px] font-bold text-dash-sidebar">
        Back to Dashboard
      </Link>
    </div>
  )
}
