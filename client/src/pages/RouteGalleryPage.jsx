import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GradeFilter from '../components/GradeFilter'
import QuickLookModal from '../components/QuickLookModal'
import RouteGallery from '../components/RouteGallery'
import { grades } from '../data/starterRoutes'

function RouteGalleryPage({ routes }) {
  const [grade, setGrade] = useState('All grades')
  const [sort, setSort] = useState('easiest')
  const [previewRoute, setPreviewRoute] = useState(null)
  const visibleRoutes = useMemo(() => {
    const filtered = grade === 'All grades' ? [...routes] : routes.filter((route) => route.grade === grade)
    return filtered.sort((a, b) => (sort === 'easiest' ? 1 : -1) * (grades.indexOf(a.grade) - grades.indexOf(b.grade)))
  }, [grade, routes, sort])

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">TRAINING WALL / ROUTE LIBRARY</p>
          <h1>Find your next problem.</h1>
          <p className="lede">Browse routes built by your crew and find a challenge at your level.</p>
        </div>
        <Link className="button button-primary" to="/routes/new">＋ New route</Link>
      </section>
      <GradeFilter grade={grade} sort={sort} onGradeChange={setGrade} onSortChange={setSort} />
      <p className="route-count">{visibleRoutes.length} routes</p>
      <RouteGallery routes={visibleRoutes} onQuickLook={setPreviewRoute} />
      {previewRoute && <QuickLookModal route={previewRoute} onClose={() => setPreviewRoute(null)} />}
    </>
  )
}

export default RouteGalleryPage
