import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/posts">Discussion Board</NavLink>
      <NavLink to="/resources">Resources</NavLink>
      {/* Add other navigation links as needed */}
    </nav>
  );
};

export default Navigation;
