import { Link } from "react-router-dom";
import "./NavBar.css";
import React, { useState, useEffect } from "react";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://faizansneakerworld-server.up.railway.app"
    : "http://localhost:3000";
const logout = async () => {
  const url = `${API_URL}/auth/logout`;
  const response = await fetch(url, { credentials: "include" });
  await response.json();
  window.location.href = "/";
};

function NavBar() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, {
        credentials: "include",
      });
      const json = await response.json();
      setUser(json.user);
    };
    getUser();
  }, [API_URL]);

  return (
    <header className="header">
      <a href="/" className="logo">
        👟 Sneaker World
      </a>
      {/* <div className="logo">Sneaker World</div> */}
      <nav className="topnav">
        <Link to="/about">🔍 About</Link>
        <Link to="/">👟 Sneakers</Link>
        {user && user.id && user.is_admin === true ? (
          <>
            <Link to="/orders">🗒️ Order </Link>
            <Link to="/new">👟 New Sneaker</Link>
          </>
        ) : (
          <></>
        )}
        {user && user.id ? (
          <>
            <Link to="/cart">🗒️ Cart</Link>
          </>
        ) : (
          <></>
        )}
        {user && user.id ? (
          <button onClick={logout} className="headerBtn">
            Logout
          </button>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
