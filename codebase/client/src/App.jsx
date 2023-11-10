import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import Home from './pages/home'
import NotFound from './pages/not-found'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
    </>
  )
}

export default App
