import "./App.css";
import { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AchievementsPage from "./pages/AchievementsPage";

const API_URL = "http://localhost:3001";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, {
        credentials: "include",
      });
      const json = await response.json();
      setUser(json.user);
    };
    getUser();
  }, []);

  const logout = async () => {
    const url = `${API_URL}/auth/logout`;
    const response = await fetch(url, { credentials: 'include' });
    const json = await response.json();
    window.location.href = "/";
  };

  const element = useRoutes([
    {
      path: "/",
      element: user && user.id ? (<HomePage user={user} api_url={API_URL} />) : (<LoginPage api_url={API_URL} />),
    },
    {
      path: "/Achievements",
      element: user && user.id ? (<AchievementsPage user={user} api_url={API_URL} />) : (<LoginPage api_url={API_URL} />),
    },
  ]);

  return (
    <div className="App">
      {user && user.id ? (
        <div className="header">
          <button onClick={logout} className='header-button'>Logout</button>
        </div>
      ) : (
        <></>
      )}
      {element}
    </div>
  );
}

export default App;