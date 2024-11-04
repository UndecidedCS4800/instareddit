import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, ResponseOrError } from './remote';
import { useAuthDispatch } from './components/auth';
import { isError, JWTTokenResponse, ServerError } from './schema';
//import { FaUser, FaLock} from "react-icons/fa";
// import { loginUser } from './remote';


export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [intent, setIntent] = useState<"login" | "register">("login")
    const [error, setError] = useState<ServerError | null>(null)
    const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string; email?: string }>({});
    const navigate = useNavigate()
    const authDispatchContext = useAuthDispatch()
    // const [errorMessage, setErrorMessage] = useState('');
    const swapIntentQuestion = intent == "login" ? "Don't have an account?" : "Already have an account?"
    const swapIntentButton = intent == "login" ? "register" : "login"

    const handleSwapIntent = () => {
        if (intent == "login") {
            setIntent("register")
        } else {
            setIntent("login")
        } 
        setFieldErrors({});
        setError(null);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null);
        setFieldErrors({});

        if (!username) {
            setFieldErrors((prev) => ({ ...prev, username: "Invalid Username" }));
            return;
        }

        if (!password) {
            setFieldErrors((prev) => ({ ...prev, password: "Password is required" }));
            return;
        }

        if (intent === "register" && !email) {
            setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
            return;
        }

        let token: ResponseOrError<JWTTokenResponse>
        if (intent === "register") {
            if (email) {
                token = (await registerUser(username, email, password))
            } else {
                token = (await loginUser(username, password))
            }
            if (isError(token)) {
                setError(token)
                switch (token.error) {
                    case "Invalid Username":
                        setFieldErrors({ username: "Invalid Username" });
                        break;
                    case "Invalid form":
                        setFieldErrors({
                            username: !username ? "Username is required" : undefined,
                            password: !password ? "Password is required" : undefined,
                            email: intent === "register" && !email ? "Email is required" : undefined,
                        });
                        break;
                    case "Password is too common":
                        setFieldErrors({ password: "Password is too common" });
                        break;
                    case "Password is too short":
                        setFieldErrors({ password: "Password is too short" });
                        break;
                    case "Email wrong format":
                        setFieldErrors({email: "Invalid email format"})
                        break;
                    case "User already exists":
                        setFieldErrors({ username: "Username is already taken", email: "Email is already in use" });
                        break;
                    default:
                        setError({ error: "An unexpected error occurred" });
                }
            } else {
                authDispatchContext({ type: "login", payload: token })
                navigate("/", { replace: true })
            }
        }
    }

    return (

            <div className="flex justify-center items-center min-h-screen bg-stone-800">
                <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
                    {error && <div className="text-red-500 text-center mb-4">{error.error}</div>}
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-bold text-center mb-8 text-pink-300">
                            <span className="text-stone-700">Only</span>
                            <span className="text-pink-300">Friends</span>
                        </h1>
                        <div className="input-box">
                        <input
                            type="text"
                            placeholder='Username'
                            name="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-white border-b-2 border-pink-300 focus:outline-none focus:border-pink-300 placeholder-pink-300 text-pink-300"
                        />
                        {fieldErrors.username && <p className="text-red-500">{fieldErrors.username}</p>}
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
                            className="w-full px-4 py-2 bg-white border-b-2 border-pink-300 focus:outline-none focus:border-pink-300 placeholder-pink-300 text-pink-300"
                        />
                        {fieldErrors.email && <p className="text-red-500">{fieldErrors.email}</p>}
                    </div>
                    }
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder='Password'
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-white border-b-2 border-pink-300 focus:outline-none focus:border-pink-300 placeholder-pink-300 text-pink-300"
                        />
                        {fieldErrors.password && <p className="text-red-500">{fieldErrors.password}</p>}
                    </div>
                    <button type="submit" 
                            name={intent} 
                            className="w-full px-4 py-2 mt-8 bg-pink-300 text-white  rounded-full hover:bg-pink-400 transition-all"
                            onClick={handleSubmit}>{intent.toUpperCase()}
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-gray-500">
                            {swapIntentQuestion}{" "}
                            <span
                                className="text-pink-500 cursor-pointer hover:text-pink-600"
                                onClick={handleSwapIntent}
                            >
                                {swapIntentButton}
                            </span>
                        </p>
                    </div>
                    {/*<div className="register-link">
                        <p>{swapIntentQuestion} <span className="register-button" onClick={handleSwapIntent}>{swapIntentButton}</span></p>
                    </div>*/}
                
                </form>
            </div>
        </div>
    );
};