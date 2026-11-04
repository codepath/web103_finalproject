import { Link } from 'react-router-dom'
import ClimbingWall from './ClimbingWall'

function RouteCard({ route, onQuickLook }) {
  return (
    <article className="route-card">
      <button className="preview-button" onClick={() => onQuickLook(route)} type="button">
        <ClimbingWall holds={route.holds} compact />
        <span className="preview-label">Quick look</span>
      </button>
      <div className="route-card-content">
        <div className="route-card-title">
          <h2>{route.name}</h2>
          <span className="grade-badge">{route.grade}</span>
        </div>
        <p>{route.wallType} wall · {route.holds.length} holds</p>
        <Link className="text-link" to={`/routes/${route.id}`}>View route →</Link>
      </div>
    </article>
  )
}

export default RouteCard
