import { Link, useNavigate, useParams } from 'react-router-dom'
import ClimbingWall from '../components/ClimbingWall'
import HoldLegend from '../components/Hold'

function RouteDetailsPage({ routes, onDelete }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const route = routes.find((item) => item.id === Number(id))
  if (!route) return <p>That route could not be found.</p>

  function handleDelete() {
    if (window.confirm(`Delete “${route.name}”?`)) {
      onDelete(route.id)
      navigate('/')
    }
  }

  return (
    <section>
      <Link className="back-link" to="/">← Back to gallery</Link>
      <div className="details-layout">
        <div>
          <p className="eyebrow">{route.wallType} WALL</p>
          <h1>{route.name}</h1>
          <div className="details-meta"><span className="grade-badge large">{route.grade}</span><span>{route.holds.length} holds</span></div>
          <div className="details-actions"><Link className="button button-primary" to={`/routes/${route.id}/edit`}>Edit route</Link><button className="button button-danger" onClick={handleDelete} type="button">Delete</button></div>
          <p className="share-hint">Share this route: <code>{window.location.href}</code></p>
        </div>
        <ClimbingWall holds={route.holds} />
      </div>
      <HoldLegend />
    </section>
  )
}

export default RouteDetailsPage
