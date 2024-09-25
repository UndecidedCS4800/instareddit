import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginUser, registerUser } from './remote';
import { useAuthDispatch } from './components/auth';
import { JWTTokenResponse } from './schema';
//import { FaUser, FaLock} from "react-icons/fa";
// import { loginUser } from './remote';


export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [intent, setIntent] = useState<"login" | "register">("login")
    const [error, setError] = useState<Error | null>(null)
    const navigate = useNavigate()
    const authDispatchContext = useAuthDispatch()
    // const [errorMessage, setErrorMessage] = useState('');
    const swapIntentQuestion = intent == "login" ? "Don't have an account?" : "Already have an account?"
    const swapIntentButton = intent == "login" ? "register" : "login"
    const handleSwapIntent = () => {
        console.log("swap intent")
        if (intent == "login") {
            setIntent("register")
        } else {
            setIntent("login")
        } 
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        let token: JWTTokenResponse
        console.log("handleSubmit")

        try {
            if (username && password) {
                if (email) {
                    token = (await registerUser(username, email, password))
                } else {
                    token = (await loginUser(username, password))
                }
                authDispatchContext({ type: "login", payload: token})
                navigate("/", { replace: true })
            }
        } catch (e) {
            if (e instanceof Error) {
                setError(e)
            }
        }
    }

    return (

            <div className='wrapper'>
                {error && <div>{error.message}</div>}
                <form onSubmit={handleSubmit}>
                    <h1>{intent.toUpperCase()}</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Username'
                            name="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    {
                    intent == "register" && 
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    }
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Password'
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" name={intent} onClick={handleSubmit}>{intent.toUpperCase()}</button>

                    
                    <div className="register-link">
                        <p>{swapIntentQuestion} <span className="register-button" onClick={handleSwapIntent}>{swapIntentButton}</span></p>
                    </div>
                </form>
            </div>
    );
};