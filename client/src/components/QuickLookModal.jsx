import { Link } from 'react-router-dom'
import WallComponent from './WallComponent'

function QuickLookModal({ route, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close quick look" type="button">×</button>
        <p className="eyebrow">QUICK LOOK</p>
        <h2>{route.name}</h2>
        <p>{route.grade} · {route.wallType} wall</p>
        <WallComponent holds={route.holds} size="sm" wallType={route.wallType} angle={route.angle} />
        <Link className="button button-primary" to={`/routes/${route.id}`} onClick={onClose}>Open full route</Link>
      </section>
    </div>
  )
}

export default QuickLookModal
