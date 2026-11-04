import RouteCard from './RouteCard'

function RouteGallery({ routes, onQuickLook }) {
  return (
    <section className="route-grid">
      {routes.map((route) => <RouteCard key={route.id} route={route} onQuickLook={onQuickLook} />)}
    </section>
  )
}

export default RouteGallery
