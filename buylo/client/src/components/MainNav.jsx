import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import logo from '../assets/logo.svg';
import '../styles/MainNav.css';

const MainNav = ({ searchTerm, onSearchChange, showSearch }) => {
  
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();
 
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="container">
      <ul>
        <li>
          <Link to="/" className="brand-link">
            <img src={logo} alt="" className="brand-logo" />
            <span className="brand-name">Buylo</span>
          </Link>
        </li>
      </ul>

      <ul>
        <li className="search-nav">
          <div className="search-wrapper">
            <input
              type="search"
              placeholder="Search our products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={!showSearch}
            />
          </div>
        </li>
      </ul>

      <ul>
        <li><Link to="/">Shop</Link></li>
        <li>
          <Link to="/cart" role="button">
            <FiShoppingCart size={20} />
            <span style={{ padding: '10px' }}>Cart</span>
          </Link>
        </li>

        {/* CONDITIONAL RENDERING BASED ON AUTH STATE */}
        {user ? (
          <>
            <li className="welcome-text">Hi, {user.first_name}</li>
            <li>
              <button 
                onClick={handleLogout} 
                className="outline logout-btn" 
                style={{ marginLeft: '10px' }}
              >
                Sign out
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" role="button" className="outline">
              Sign in
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MainNav;