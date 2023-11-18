import React, { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import Listings from "./pages/Listings";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import IndividualListings from "./pages/IndividualListings";
import Policies from "./pages/Policies";

function App() {
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL =
    process.env.NODE_ENV === "production"
      ? import.meta.env.VITE_SERVER_URL
      : "http://localhost:3001";

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch(`${API_URL}/api`);
      const data = await response.json();
      setListings(data);
    };
    fetchListings();
  }, []);

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: <Listings data={listings} />,
    },
  ]);

  return (
    <div className="App">
      <header>
        <Navbar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </header>
      <div
        className={`main-content ${isModalOpen ? "blur-3xl bg-white/30" : ""}`}
      >
        {element}
      </div>
      <Routes>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/policy" element={<Policies/>} />
        <Route path="/listings/:id" component={IndividualListings} />
      </Routes>
    </div>
  );
}

export default App;
