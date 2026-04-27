import { NavLink, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import './NavBar.css';

const NavBar = () => {
    const [query, setQuery] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            const savedUser = localStorage.getItem('flowerhuntUser');
            setUser(savedUser ? JSON.parse(savedUser) : null);
        };

        loadUser();

        window.addEventListener('authChanged', loadUser);

        return () => {
            window.removeEventListener('authChanged', loadUser);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/discover?search=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('flowerhuntToken');
        localStorage.removeItem('flowerhuntUser');
        setUser(null);
        navigate('/');
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

                {user ? (
                    <li>
                        <button className="navbar-auth-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                ) : (
                    <li><NavLink to="/login">Login</NavLink></li>
                )}
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