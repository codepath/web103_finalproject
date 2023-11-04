import { useState } from 'react'
import './App.css'
import AllPosts from './pages/AllPosts'
import FullPost from './pages/FullPost'
import Homepage from './pages/Homepage'
import NavBar from './components/NavBar'
import { useRoutes } from 'react-router-dom'

function App() {
  let element = useRoutes([
    {
      path: '/',
      element: <Homepage />
    },
    {
      path: '/posts',
      element: <AllPosts />
    },
    {
      path: '/posts/:id',
      element: <FullPost />
    }
  ])
  return (
    <div className="App">
       <header>
        <NavBar />
       </header>

       {element}
    </div>
  )
}

export default App
