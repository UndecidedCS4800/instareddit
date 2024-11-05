import React from "react";
import {Link} from 'react-router-dom';

import { useAuth, useAuthDispatch } from "./components/auth";

function Greeting({name, ...props}: React.HTMLProps<HTMLAnchorElement> & {name: string}) {
    return <a {...props}>Logout of  {name}</a>
}

const NavBar: React.FC = () => {
    const auth = useAuth()
    const authDispatch = useAuthDispatch()
    let loginLink =  (
        <Link to="/login" className="flex items-center justify-center px-4 py-2 text-white hover:bg-[#e78fcb] hover:text-white transition-colors duration-200">
            Login
        </Link>
    )
    if (auth) {
        loginLink = 
            <Greeting 
                name={auth.username} 
                onClick={() => authDispatch({type: "logout"})}
                className="flex items-center justify-center px-4 py-2 text-white hover:bg-[#e78fcb] hover:text-white transition-colors duration-200"
            />
    }
    return (
        <nav className="h-screen basis-3/12 bg-[#342c33] text-white border-r border-[#514350]">
            <div className="flex items-center justify-center p-6">
                <h1 className="text-3xl">
                    <span className="text-white font-normal">Only</span>
                    <span className="text-[#e78fcb] font-bold">Friends</span>
                </h1>
            </div>
            <ul className="flex flex-col mt-5">
                <li className="nav-item">
                    <Link to="/" className="flex items-center justify-center px-4 py-2 text-white hover:bg-[#e78fcb] hover:text-white transition-colors duration-200">
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/about" className="flex items-center justify-center px-4 py-2 text-white hover:bg-[#e78fcb] hover:text-white transition-colors duration-200">
                        About Us
                    </Link>
                </li>
                {auth && <li className="nav-item">
                    <Link to={`/user/${auth.username}`} className="flex items-center justify-center px-4 py-2 text-white hover:bg-[#e78fcb] hover:text-white transition-colors duration-200">
                        Profile
                    </Link>
                </li>}
                <li className="nav-item">
                    <Link to="/messages" className="flex items-center justify-center px-4 py-2 text-white hover:bg-[#e78fcb] hover:text-white transition-colors duration-200">
                        Messages
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/notifications" className="flex items-center justify-center px-4 py-2 text-white hover:bg-[#e78fcb] hover:text-white transition-colors duration-200">
                        Notifications
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
