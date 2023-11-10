import React from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CreateBoard from "./pages/CreateBoard";

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
    {
      path: "/createboard",
      element: <CreateBoard />,
    },
  ]);
  return (
    <div className="app">
      <Navbar />
      {element}
    </div>
  );
};

export default App;
