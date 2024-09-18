import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './remote'; 
import Login from './Login';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await registerUser(username, email, password);
            navigate('/');
        } catch (error) {
            setErrorMessage('Unable to register');
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleRegister}>
                <h1>Register</h1>

                <div className='input-box'>
                    <input
                        type="text"
                        placeholder='Username'
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                </div>
                <div className='input-box'>
                    <input
                        type="email"
                        placeholder='Email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className='input-box'>
                    <input
                        type="password"
                        placeholder='Password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* display error message if unsuccessful */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit">Register</button>

                <div className='register-link'>
                    <p>Already have an account? <span className="register-button" onClick={() => navigate('/login')}>Login</span></p>
                </div>
            </form>
        </div>
    );
};

export default Register;
