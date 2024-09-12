import React from "react";
import {Link} from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/about">About Us</Link>
                </li>
                <li className="nav-item">
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        </nav>
    );
};
export default NavBar;
