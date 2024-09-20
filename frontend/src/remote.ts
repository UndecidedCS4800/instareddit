const URL = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}`;

export const getData = async <T>(relative_path: string): Promise<T[]> => {
    try {
        const response = await fetch(`${URL}/api/${relative_path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            // Check if there's a response body and log it
            const errorData = await response.json();
            console.error('Error fetching data:', response.status, response.statusText, errorData);
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const json = await response.json();
        return json as T[];
    } catch (error) {
        console.error('Error in getData function:', error);
        throw error; // Rethrow to allow further handling if needed
    }
};



// Function to register a new user
export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const response = await fetch(`${URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            // Check if there's a response body and log it
            const errorData = await response.json();
            console.error('Error registering user:', response.status, response.statusText, errorData);
            throw new Error(`Registration Unsuccessful: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in registerUser function:', error);
        throw error; // Rethrow to allow further handling if needed
    }
};

// Function to log a user in and store JWT
export const loginUser = async (username: string, password: string) => {
    try {
        const response = await fetch(`${URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error logging in:', response.status, response.statusText, errorData);
            throw new Error(`Login Unsuccessful: ${response.statusText}`);
        }

        const data = await response.json();

        // Storing JWT
        if (data.token) {
            localStorage.setItem('token', data.token);
        }

        return data;
    } catch (error) {
        console.error('Error in loginUser function:', error);
        throw error; // Rethrow to allow further handling if needed
    }
};


// Function to log a user out
export const logoutUser = () => {
    try {
        localStorage.removeItem('token');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};
