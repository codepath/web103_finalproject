import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { useRoutes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateGroup from './pages/CreateGroup.js';
import GroupDetails from './pages/GroupDetails.js';
import Header from './components/Header.js';



function App() {

  const API_URL = 'http://localhost:4000'
  const [user, setUser] = useState();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, { credentials: 'include' } )
      const json = await response.json()
      setUser(json.user)
    }

    const fetchGroups = async () => {
      const response = await fetch("http://localhost:4000/api/groups");
      const data = await response.json();
      console.log(data);
      setGroups(data);
    };
    
    getUser()
    fetchGroups();
  }, [])


  let element = useRoutes([
    {
    path: '/',
    element: user && user.id ?
      <HomePage user={user} data={groups}/> : <LoginPage api_url={API_URL} />
    },
    {
      path: '/groups/new',
      element: user && user.id ?
        <CreateGroup user={user} api_url={API_URL} /> : <LoginPage api_url={API_URL} />
    },
    {
      path: '/groups/get/:id',
      element: user && user.id ?
          <GroupDetails user={user} data={groups} api_url={API_URL} /> : <LoginPage api_url={API_URL} />
    }
  ])


  return (
    <div className="App">
      <Header />
      {element} 
    </div>
  );
}

export default App;
