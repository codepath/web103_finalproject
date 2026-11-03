import { Link, useNavigate, useParams } from 'react-router-dom'
import RouteForm from '../components/RouteForm'

function EditRoutePage({ routes, onSave }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const route = routes.find((item) => item.id === Number(id))
  if (!route) return <p>That route could not be found.</p>

  return (
    <section>
      <Link className="back-link" to={`/routes/${route.id}`}>← Cancel</Link>
      <div className="builder-heading"><p className="eyebrow">EDIT ROUTE</p><h1>Tune your route.</h1></div>
      <RouteForm existing={route} onSave={(updatedRoute) => { onSave(updatedRoute); navigate(`/routes/${route.id}`) }} />
    </section>
  )
}

export default EditRoutePage
