import { Teammate } from "./schema"

const URL = `${import.meta.env.VITE_BACKEND_URL}`

export const getData = async (): Promise<Teammate[]> => {
    const get = await fetch(URL+"/api", {
        method: 'GET',
        headers: {
            'Content-Type': "application/json"
        },
    })

    const json = await get.json();
    return json as Teammate[]
}

// Function to register new user
export const registerUser = async(username: string, email: string, password: string) => {
    const response = await fetch(URL+"/api/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        // creates user data
        body: JSON.stringify({username, email, password}),
    });

    if(!response.ok){
        throw new Error('Registration Unsuccessful');
    }
    return response.json();
};

// Function to log user in and store jwt
export const loginUser = async(username: string, password: string) => {
    const response = await fetch('${URL}/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if(!response.ok){
        throw new Error('Login Unsuccessful');
    }
    const data = await response.json();

    // Storing jwt
    if(data.token) {
        localStorage.setItem('token', data.token)
    }
    return data;
};

// Function to log user out
export const logoutUser = () => {
    localStorage.removeItem('token');
}
