import { useNavigate } from 'react-router-dom'
import RouteForm from '../components/RouteForm'

function RouteBuilderPage({ routes, onSave }) {
  const navigate = useNavigate()

  function handleRandomRoute() {
    if (routes.length === 0) return
    const random = routes[Math.floor(Math.random() * routes.length)]
    navigate(`/routes/${random.id}`)
  }

  return (
    <section>
      <button className="back-link" onClick={() => navigate('/')} type="button">← Cancel</button>
      <div className="builder-heading"><p className="eyebrow">ROUTE BUILDER</p><h1>Build a new route.</h1></div>
      <div className="builder-options">
        <div className="builder-option">
          <p className="builder-option-label">Create</p>
          <button className="button button-reset" onClick={handleRandomRoute} type="button">⟳ Random Route</button>
        </div>
        <div className="builder-option-divider">or</div>
        <div className="builder-option">
          <p className="builder-option-label">Design your own</p>
        </div>
      </div>
      <RouteForm onSave={(route) => { onSave(route); navigate('/') }} />
    </section>
  )
}

export default RouteBuilderPage
