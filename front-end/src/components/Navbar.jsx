import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark">◈</span>
        <span>Crux Maker</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link to="/">Route Gallery</Link>
        <Link className="button button-primary" to="/routes/new">
          Build a route
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
