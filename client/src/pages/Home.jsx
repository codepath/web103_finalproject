// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to CodeFM</h1>
      <nav>
        <Link to="/posts">Discussion Board</Link>
        <Link to="/resources">Learning Resources</Link>
      </nav>
    </div>
  );
};

export default Home;

