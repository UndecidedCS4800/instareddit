import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
//import { FaUser, FaLock} from "react-icons/fa";
import { loginUser } from './remote';
import Register from './Register';


const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginUser(username, password);

            navigate('/');
        } catch (error) {
            setErrorMessage('Login failed');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className='wrapper'>
            <form action="">
                <h1>Login</h1>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder='Username' 
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder='Password' 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="remeber-forgot">
                    <label><input type="checkbox" />Remember me </label>
                    <a href="#">Forgot password?</a>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <span className="register-button" onClick={handleRegisterRedirect}>Register</span></p>
                </div>
            </form>
        </div>
    );
};
export default Login;