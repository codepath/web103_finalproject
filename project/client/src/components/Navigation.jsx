import React from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import '../css/Navigation.css';

const Navigation = ({ userName = '', onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/journals" style={{ textDecoration: "none", color: "inherit" }}>
          <h1>StickerStory</h1>
        </Link>
      </div>

      <div className="navbar-right">
        {userName && <div className="user-box">{userName}</div>}
        <i
          className="fa-solid fa-right-from-bracket logout-icon"
          onClick={onLogout}
          title="Logout"
        ></i>
      </div>
    </nav>
  );
};

export default Navigation;
