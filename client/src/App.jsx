import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { UserContext } from './UserContext'
import Home from './Pages/HOME/Home';
import Login from './Pages/Login/Login';

function App() {
  const [userContext, setUserContext] = useState(() => {
    try {
      // Retrieve the user data from storage or set it to null if not found
      const storedUser = localStorage.getItem("userContext");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  });

  useEffect(() => {
    // Save the user data to storage whenever the user state changes
    if (userContext) {
      localStorage.setItem("userContext", JSON.stringify(userContext));
    } else {
      localStorage.removeItem("userContext");
    }
  }, [userContext]);

  return (
    <>
      <UserContext.Provider value={{ userContext, setUserContext }}>
      <BrowserRouter>
      <Routes>
      <Route
       path="/"
       element={userContext ? <Home /> : <Login/>}
       />
      <Route
        path="/login"
        element={<Login/>}
      />
      <Route
        path="/home"
        element={<Home/>}
      />
      </Routes>
      </BrowserRouter>
      </UserContext.Provider>




    </>
  )
}

export default App
