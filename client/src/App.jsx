import './App.css'
import { NavLink, useRoutes } from 'react-router'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import Meals from './pages/Meals'
import CreateMeal from './pages/CreateMeal'
import FoodLibrary from './pages/FoodLibrary'
import AddFoodItem from './pages/AddFoodItem'
import MealDetail from './pages/MealDetail'

const App = () => {
  const element = useRoutes([
    { path: '/',           element: <Dashboard /> },
    { path: '/goals',      element: <Goals /> },
    { path: '/meals',      element: <Meals /> },
    { path: '/meals/new',  element: <CreateMeal /> },
    { path: '/foods',      element: <FoodLibrary /> },
    { path: '/foods/new',  element: <AddFoodItem /> },
    { path: '/meals/:id',  element: <MealDetail /> },
  ])

  return (
    <div className="app">
      <header className="header">
        <NavLink to="/" className="header-brand">MacroMate</NavLink>
        <NavLink to="/"      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Dashboard</NavLink>
        <NavLink to="/goals" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Goals</NavLink>
        <NavLink to="/meals" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Meals</NavLink>
        <NavLink to="/foods" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Food Library</NavLink>
      </header>
      {element}
    </div>
  )
}

export default App
