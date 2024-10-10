import React from "react";
import {Link} from 'react-router-dom';

import { useAuth, useAuthDispatch } from "./components/auth";

function Greeting({name, ...props}: React.HTMLProps<HTMLAnchorElement> & {name: string}) {
    return <a {...props}>Hello, {name}</a>
}

const NavBar: React.FC = () => {
    const auth = useAuth()
    const authDispatch = useAuthDispatch()
    let loginLink =  (
        <Link to="/login" className="flex items-center justify-center px-4 py-2 text-white hover:bg-pink-300 hover:text-white transition-colors duration-200">
            Login
        </Link>
    )
    if (auth) {
        loginLink = 
            <Greeting 
                name={auth.username} 
                onClick={() => authDispatch({type: "logout"})}
                className="flex items-center justify-center px-4 py-2 text-white hover:bg-pink-300 hover:text-white transition-colors duration-200"
            />
    }
    return (
        <nav className="h-screen basis-4/12 bg-stone-800 text-white">
            <div className="flex items-center justify-center bg-stone-800 h-20">
                <h1 className="text-2xl">
                    <span className="text-white font-normal">Only</span>
                    <span className="text-pink-400 font-bold">Friends</span>
                </h1>
            </div>
            <ul className="flex flex-col mt-10">
                <li className="nav-item">
                    <Link to="/" className="flex items-center justify-center px-4 py-2 text-white hover:bg-pink-300 hover:text-white transition-colors duration-200">
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/about" className="flex items-center justify-center px-4 py-2 text-white hover:bg-pink-300 hover:text-white transition-colors duration-200">
                        About Us
                    </Link>
                </li>
                <li className="nav-item">
                    {loginLink}
                </li>
            </ul>
        </nav>
    );
 };
 export default NavBar;
 