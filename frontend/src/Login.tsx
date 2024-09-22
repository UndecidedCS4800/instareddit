import React, { useState } from 'react';
import { Form, redirect, useActionData } from 'react-router-dom';
import './Login.css';
import { loginUser } from './remote';
//import { FaUser, FaLock} from "react-icons/fa";
// import { loginUser } from './remote';


export const action = async ({request}: { request: Request}) => {
    let formData = await request.formData();
    let username = formData.get("username")?.toString() 
    let password = formData.get("password")?.toString()

    if (username && password) {
        const {token} = await loginUser(username, password)
        localStorage.setItem("token", token)
        return redirect("/")
    }

    else return { "error": "Enter a login and password" }
}


export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [intent, setIntent] = useState<"login" | "register">("login")
    // const [errorMessage, setErrorMessage] = useState('');
    const actionData = useActionData() as null | { error: string}

    return (

            <div className='wrapper'>
                {actionData && actionData.error }
                <Form action="post">
                    <h1>Login</h1>
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
                    <div className="remeber-forgot">
                        <label><input type="checkbox" />Remember me </label>
                        <a href="#">Forgot password?</a>
                    </div>
                    {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
                    <button type="submit" name={intent}>Login</button>
                    <div className="register-link">
                        <p>Don't have an account? <span className="register-button" onClick={handleRegisterRedirect}>Register</span></p>
                    </div>
                </Form>
            </div>
    );
};