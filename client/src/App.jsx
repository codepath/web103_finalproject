import React from 'react'
import { useRoutes } from 'react-router-dom'

import Navigation from './components/Navigations.jsx'
import CreateMovie from './pages/CreateMovie.jsx'
import ViewMovies from './pages/ViewMovies.jsx'
import EditMovie from './pages/EditMovie.jsx'
import WishList from './pages/WishList.jsx'

import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <ViewMovies title='CINEMUNDO | View' />
    },
    {
      path: '/edit/:id',
      element: <EditMovie title='CINEMUNDO | Edit' />
    },
    {
      path: '/create',
      element: <CreateMovie title='CINEMUNDO | Create' />
    },
    {
      path: '/wishlist',
      element: <WishList title='CINEMUNDO | Wish List' />
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