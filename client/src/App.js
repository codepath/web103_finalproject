import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { useRoutes } from 'react-router-dom';
import { useEffect, useState } from 'react';



function App() {

  const API_URL = 'http://localhost:4000'
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, { credentials: 'include' } )
      const json = await response.json()
      setUser(json.user)
    }
    
    getUser()
  }, [])


  let element = useRoutes([
    {
    path: '/',
    element: user && user.id ?
      <HomePage /> : <LoginPage api_url={API_URL} />
    }
  ])

  return (
    <div className="App">
      {element} 
    </div>
  );
}

export default App;
