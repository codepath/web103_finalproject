import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { starterRoutes } from './data/starterRoutes'
import EditRoutePage from './pages/EditRoutePage'
import RouteBuilderPage from './pages/RouteBuilderPage'
import RouteDetailsPage from './pages/RouteDetailsPage'
import RouteGalleryPage from './pages/RouteGalleryPage'
import './App.css'

function App() {
  const [routes, setRoutes] = useState(starterRoutes)

  function saveRoute(route) {
    setRoutes((current) => {
      const exists = current.some((item) => item.id === route.id)
      return exists ? current.map((item) => (item.id === route.id ? route : item)) : [...current, { ...route, id: Date.now() }]
    })
  }

  function deleteRoute(id) {
    setRoutes((current) => current.filter((route) => route.id !== id))
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<RouteGalleryPage routes={routes} />} />
          <Route path="/routes/new" element={<RouteBuilderPage onSave={saveRoute} />} />
          <Route path="/routes/:id" element={<RouteDetailsPage routes={routes} onDelete={deleteRoute} />} />
          <Route path="/routes/:id/edit" element={<EditRoutePage routes={routes} onSave={saveRoute} />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
