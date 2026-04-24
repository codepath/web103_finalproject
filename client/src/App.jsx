import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import Meals from './pages/Meals'
import CreateMeal from './pages/CreateMeal'
import FoodLibrary from './pages/FoodLibrary'
import AddFoodItem from './pages/AddFoodItem'
import MealDetail from './pages/MealDetail'
import NutriBot from './components/NutriBot/NutriBot'
import Log from './pages/Log'

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      
      if (!token || !userId) {
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`/api/users/${userId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const user = await response.json()
          setLoggedInUser(user)
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setLoggedInUser(null)
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#4a6cf7'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <>
      {loggedInUser && (
        <header className="header">
          <NavLink to="/" className="header-brand">MacroMate</NavLink>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to="/goals" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Goals
            </NavLink>
            <NavLink to="/meals" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Meals
            </NavLink>
            <NavLink to="/foods" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Food Library
            </NavLink>
            <NavLink to="/log" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Log
            </NavLink>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#a0a8c0', fontSize: '14px' }}>
              👋 {loggedInUser.name}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #dc3545',
                color: '#dc3545',
                padding: '5px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </div>
        </header>
      )}
      
      <Routes>
        <Route path="/login" element={
          loggedInUser ? <Navigate to="/" /> : <Login setLoggedInUser={setLoggedInUser} />
        } />
        <Route path="/" element={
          loggedInUser ? <Dashboard user={loggedInUser} /> : <Navigate to="/login" />
        } />
        <Route path="/goals" element={
          loggedInUser ? <Goals user={loggedInUser} setUser={setLoggedInUser} /> : <Navigate to="/login" />
        } />
        <Route path="/meals" element={
          loggedInUser ? <Meals user={loggedInUser} /> : <Navigate to="/login" />
        } />
        <Route path="/meals/new" element={
          loggedInUser ? <CreateMeal user={loggedInUser} /> : <Navigate to="/login" />
        } />
        <Route path="/meals/:id" element={
          loggedInUser ? <MealDetail user={loggedInUser} /> : <Navigate to="/login" />
        } />
        <Route path="/foods" element={
          loggedInUser ? <FoodLibrary user={loggedInUser} /> : <Navigate to="/login" />
        } />
        <Route path="/foods/new" element={
          loggedInUser ? <AddFoodItem user={loggedInUser} /> : <Navigate to="/login" />
        } />
        <Route path="/log" element={
          loggedInUser ? <Log user={loggedInUser} /> : <Navigate to="/login" />
        } />
      </Routes>
      {loggedInUser && <NutriBot />}
    </>
  )
}

export default App