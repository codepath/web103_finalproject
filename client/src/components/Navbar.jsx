import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const { isAuthenticated, user, setAuthInfo } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // This will cause the component to re-render when isAuthenticated changes
  }, [isAuthenticated]);
  const handleLogout = () => {
    axios.get(`${window.API_URL}/auth/logout`, { withCredentials: true })
      .then(() => {
        // Update auth state
        setAuthInfo({ isAuthenticated: false, user: null });
      })
      .catch(error => {
        console.error('Logout failed', error);
      });
  };
  
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
      {/* <img src="/logo.PNG" alt="Logo" className="logo" /> */}
      <img
        src="/logo.PNG"
        alt="Logo"
        className="logo"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      />
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
        <Link to="/posts" className="link">
          Discussion Board
        </Link>
      </div>
      <nav>
        {isAuthenticated ? (
          <div>
            {user.username ? (
              <span>{user.username}</span>
            ) : (
              <span>User</span>
            )}
            <button onClick={handleLogout}>Logout</button>
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
