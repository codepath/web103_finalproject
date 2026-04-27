import React from 'react';
import { Link } from 'react-router';
import './Footer.css';
const Footer = () => {
    return (
        <footer className="footer">
            <ul className="footer-content">
                <li><p>Contact Us</p></li>
                <li><p>flowerhunt@gmail.com</p></li>
                <li><p>&copy; {new Date().getFullYear()} FlowerHunt</p></li>
                <li><p>347-300-0000</p></li>
            </ul>
            <ul className="footer-link">
                <li><Link to="/about">About</Link></li>
            </ul>

        </footer>
    );
};

export default Footer;
