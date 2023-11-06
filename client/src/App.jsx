import React, { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import stayvueLogo from "./assets/StayVue.png";
import Listings from "./pages/Listings";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const [listings, setListings] = useState([]);
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
      element: (
        // user && user.id ? (
        <Listings data={listings} />
      ),
      // ) : (
      //   <Login api_url={API_URL} />
      // ),
    },
  ]);

  return (
    <div className="App">
      <header>
        <div className="container">
          <img src={stayvueLogo} className="stayvue-logo" alt="StayVue" />
          <nav>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Add Listing</a>
              </li>
              <li>
                <a href="#">View Perks</a>
              </li>
              <li>
                <a href="#">Messages</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {element}
    </div>
  );
}

export default App;
