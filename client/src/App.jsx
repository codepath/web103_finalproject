import './App.css'
import { useRoutes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import AchievementsPage from "./pages/AchievementsPage"


function App() {
  const element = useRoutes([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/:id',
      element: <HomePage />
    },
    {
      path: '/Achievements',
      element: <AchievementsPage />
    },
    {
      path: '/Login',
      element: <LoginPage />
    }
  ])

  return (
    <div className='app'>
      {element}
    </div>
  )
}

export default App
