import { NavLink, useNavigate } from 'react-router';
import { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/discover?search=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    };

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-brand">
                🌸 FlowerHunt
            </NavLink>
            <ul className="navbar-links">
                <li><NavLink to="/discover">Discover Flowers</NavLink></li>
                <li><NavLink to="/dictionary">Flower Dictionary</NavLink></li>
                <li><NavLink to="/scan">Scan-A-Flower</NavLink></li>
                <li><NavLink to="/gallery">Flower Gallery</NavLink></li>
            </ul>
            <form className="navbar-search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search flowers..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                    🔍
                </button>
            </form>
        </nav>
    );
};

export default NavBar;
