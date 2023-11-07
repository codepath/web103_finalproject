import React, { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import stayvueLogo from "./assets/StayVue.png";
import Listings from "./pages/Listings";
import { Link } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = "http://localhost:3001";

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
    </div>
  );
}

export default App;
