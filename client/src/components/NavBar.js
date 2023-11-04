import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";


function NavBar(){


    return(

        <header className="header">
            {/* <a href="/" className="logo">👟 Sneaker World</a> */}
            <div className="logo">Sneaker World</div>

            <nav className="topnav">
                <Link to="/about">🔍 About</Link>
                <Link to="/">👟 Sneakers</Link>
                <Link to="/order">🗒️ Order </Link>
            </nav>
        </header>

    );
}

export default NavBar;