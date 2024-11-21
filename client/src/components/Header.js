import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="container-fluid bg-primary text-white py-3 sticky-top">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="m-0">Learn More 2gether</h1>
        <nav>
          <Link to="/"><button className="headerBtn"> Home </button></Link>
          <Link to="/groups/new"><button className="headerBtn"> + Create new group </button></Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
