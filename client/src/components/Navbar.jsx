import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const loginButtonStyle = {
    backgroundColor: 'orange', 
    color: 'white', 
    padding: '5px 10px', 
    borderRadius: '5px', 
    textDecoration: 'none', 
    boxShadow: 'none', 
  };

  return (
    <div className="navbar">
      <img src="/logo.PNG" alt="Logo" className="logo" />
      <div className="link-container">
        <Link to="/about" className="link">
          About Us
        </Link>
        <Link to="/events" className="link">
          Events
        </Link>
        <Link to="/resources" className="link">
          Resources
        </Link>
      </div>
      <nav>
        {isAuthenticated ? (
          <div>
            <img src={user.avatarUrl} alt="User" />
            {/* Implement logout functionality */}
          </div>
        ) : (
          <Link to="/login">
            <button style={loginButtonStyle}>Login</button>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
