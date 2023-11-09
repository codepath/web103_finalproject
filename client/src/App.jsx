import React from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  const element = useRoutes([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Home />,
    },
  ]);

  return <div className="app">{element}</div>;
};

export default App;
