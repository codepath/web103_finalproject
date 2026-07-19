import React from 'react'
import logo from '../assets/logo.svg'
import '../styles/MainNav.css'
import { Link } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";


const MainNav = () => {
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
                <input type="search" placeholder="Search our products..." />                
              </div>       
            </li>
          </ul>
        <ul>
          <li><Link to="/">Shop</Link></li>
          <li><Link to="/cart" role="button">
                <FiShoppingCart size={20}/>
                <span style={{ padding:'10px'}}>Cart</span>
                </Link>
          </li>
          <li><Link to="/login" role="button" className="outline">Login</Link></li>
        </ul>
      </nav>
  )
}

export default MainNav