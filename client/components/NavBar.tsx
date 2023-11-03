import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const NavBar = () => {
  return (
    <div className="flex bg-black">
      <Link to="/">
        <img src='/logo2.png' alt="logo" />
      </Link>
      <SearchBar />
    </div>
  );
};

export default NavBar;
