import React from 'react'
import { useRoutes, Link } from 'react-router-dom'
import Home from './pages/Home'
import PlanTrip from './pages/PlanTrip'
import Navigation from './components/Navigation'
import './App.css';
import './index.css';


const App = () => {
  let element = useRoutes([
    {
       path: '/',
       element: <Home />
    },
    {
      path: '/planYourTrip',
      element: <PlanTrip />
    }
  ])

  return (
    <div className='app'>
      <Navigation />
      { element }
    </div>
  )
}

export default App