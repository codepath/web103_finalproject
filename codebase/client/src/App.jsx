import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Redirect,
} from 'react-router-dom'
import Home from './pages/home'
import NotFound from './pages/not-found'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route element={<Home />} exact path="/" />
        <Route element={<NotFound />} path="**" />
        {/* <Redirect to="**" /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App
