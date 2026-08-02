import { useState, useEffect } from 'react'
import { useRoutes, Link, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Kitchen from './pages/Kitchen.jsx'
import AddIngredient from './pages/AddIngredient.jsx'
import EditIngredient from './pages/EditIngredient.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import EditPreferences from './pages/EditPreferences.jsx'
import Recipe from './pages/Recipe.jsx'
import Calendar from './pages/Calendar.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  const API_URL = "http://localhost:3000";

  const getUser = async () => {
    const response = await fetch(`${API_URL}/auth/login/success`, { credentials: 'include' } )

    if (!response.ok) {
      setUser(null)
      setLoggedIn(false)
      return
    }

    const json = await response.json()
    setUser(json.user)
    setLoggedIn(true)
  }

  useEffect(() => {
    getUser()
  }, []);
  
  // let routes = useRoutes([
  //   {
  //     path:'/',
  //     element: <Login />
  //   },
  //   {
  //     path:'/home',
  //     element: <Home />
  //   },
  //   {
  //     path:'/kitchen',
  //     element: <Kitchen />
  //   },
  //   {
  //     path:'/addIngredient',
  //     element: <AddIngredient />
  //   },
  //   {
  //     path:'/editIngredient/:id',
  //     element: <EditIngredient />
  //   },
  //   {
  //     path:'/login',
  //     element: <Login />
  //   }
  // ])
  

  let routes = useRoutes([
    {
      path: '/',
      element: <Home user={user} />
    },
    {
      path: '/home',
      element: <Home user={user} />
    },
    {
      path: '/kitchen',
      element: user && user.id 
        ? <Kitchen user={user} /> 
        : <Login api_url={API_URL} />
    },
    {
      path: '/addIngredient',
      element: user && user.id 
        ? <AddIngredient user={user} api_url={API_URL} /> 
        : <Login api_url={API_URL} />
    },
    {
      path: '/editIngredient/:id',
      element: user && user.id 
        ? <EditIngredient user={user} api_url={API_URL} /> 
        : <Login api_url={API_URL} />
    },
    {
      path: '/profile',
      element: user && user.id
      ? <Profile user={user}></Profile>
      : <Login></Login>
    },
    {
      path: '/login',
      element: <Login api_url={API_URL} />
    },
    {
      path:'/edit/preferences',
      element: user && user.id
      ? <EditPreferences user={user}></EditPreferences>
      : <Login></Login>
    },
    {
      path: '/recipe/:id',
      element: user && user.id
      ? <Recipe></Recipe>
      : <Login></Login>
    },
    {
      path: '/calendar',
      element: user && user.id
      ? <Calendar></Calendar>
      : <Login></Login>
    },
    {
      path: '/admin',
      element: user && user.is_admin
      ? <Admin></Admin>
      : <Login></Login>
    },
  ])




  return (
    <div>
      {loggedIn && !isLoginPage && <Nav user={user}></Nav>}
      {!loggedIn && !isLoginPage && (
        <div style={styles.guestBar}>
          <span style={{ fontWeight: 700 }}>EatRite</span>
          <Link to="/login" style={styles.guestLink}>Log in</Link>
        </div>
      )}
      {routes}
    </div>
  )
}

export default App

const styles = {
  guestBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: 'solid black',
    borderWidth: '2px',
    height: '60px',
    padding: '0 20px',
    marginBottom: '5px',
    fontSize: '20px',
  },
  guestLink: {
    textDecoration: 'none',
    color: 'black',
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '5px',
    padding: '8px 16px',
  },
}
