import React from "react";
import {Link} from 'react-router-dom';
import './NavBar.css';
import { useAuth, useAuthDispatch } from "./components/auth";

const NavBar: React.FC = () => {
    const auth = useAuth()
    const authDispatch = useAuthDispatch()
    let loginLink =  (<Link to="/login">Login</Link>)
    if (auth) {
        loginLink = <a onClick={() => authDispatch({type: "logout"})}>Logout</a>
    }
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
                    {loginLink}
                </li>
            </ul>
        </nav>
    );
};
export default NavBar;
