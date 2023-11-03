import React from 'react'
import {useRoutes} from 'react-router-dom'

import ListingsPage from './pages/ListingsPage/ListingsPage'
import Listing from './pages/Listing/Listing'
import TeneesPage from './pages/TeneesPage/TeneesPage'
import Tenee from './pages/Tenee/Tenee'
import UserProfile from './pages/UserProfile/UserProfile'
import Login from './pages/Login/Login'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import Onboarding from './pages/Onboarding/Onboarding'

import Header from './components/Header'
import Footer from './components/Footer'

import './App.css'


function App() {
  let element = useRoutes([
    {
      path: '/', 
      element: <ListingsPage />
    },
    {
      path: '/listing/:id', element: <Listing />
    },
    {
      path: '/tenees', element: <TeneesPage />
    },
    {
      path: '/tenee/:id', element: <Tenee />
    },
    {
      path: '/user', element: <UserProfile />
    },
    {
      path: '/login', element: <Login />
    },
    {
      path: '/favorites', element: <FavoritesPage />
    },
    {
      path: '/onboarding', element: <Onboarding />
    }
  ])

  return (
    <div className="App">
      <Header />
      {element}
      <Footer />
    </div>
  )
}

export default App
