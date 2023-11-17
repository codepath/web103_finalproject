import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
const API_URL = "http://localhost:3000";
const logout = async () => {
  const url = `${API_URL}/auth/logout`;
  const response = await fetch(url);
  await response.json();
  window.location.href = "/";
};

function NavBar() {
  return (
    <header className="header">
      {/* <a href="/" className="logo">👟 Sneaker World</a> */}
      <div className="logo">Sneaker World</div>

      <nav className="topnav">
        <Link to="/about">🔍 About</Link>
        <Link to="/">👟 Sneakers</Link>
        <Link to="/orders">🗒️ Order </Link>
        <Link to="/cart">🗒️ Cart</Link>
        <Link to="/new">👟 New Sneaker</Link>
        <button onClick={logout} className="headerBtn">
          Logout
        </button>
      </nav>
    </header>
  );
}

export default NavBar;
