import { Community, JWTTokenResponse, PaginationResponse, Post, ServerError } from "./schema";

const URL = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}`;
export type ResponseOrError<T> = T | ServerError;
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
export const registerUser = async (username: string, email: string, password: string): Promise<JWTTokenResponse> => {
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


async function get<T>(relative_path: string): Promise<ResponseOrError<T>> {
    try {
        const req = await fetch(`${URL}${relative_path}`, {
            headers: {
                'Content-Type': "application/json"
            }
        })
        if (!req.ok) {
            const json = req.json()
            return json as unknown as ServerError
        }
        const json = req.json();
        return json as unknown as T
    } catch (e) {
        if (e instanceof Error) {
            console.log("Unhandled error:", e.name, e.message)
            return {error: e.message}
        }
        console.log("Unknown exception thrown")
        return {error: "Unknown exception thrown"}
    }
}

export const getCommunities = async (query?: string): Promise<ResponseOrError<PaginationResponse<Community>>> => {
    const query_string = query ? `?query={${query}}` : ""
    return await get(`/api/communities${query_string}`)
}

export const getCommunityPosts = async (id: number): Promise<ResponseOrError<PaginationResponse<Post>>> => {
    return await get(`/api/community/${id}`)
}

export const getCommunity = async (id: number): Promise<ResponseOrError<Community>> => {
    return await get(`/api/community/${id}/about`)
}

export const getPostComments = async (communityid: number, postid: number) : Promise<ResponseOrError<Post>> => {
    return await get(`/api/community/${communityid}/post/${postid}`)
}

export const getUserPosts = async (username: string): Promise<ResponseOrError<Post[]>> => {
    return await get(`/api/${username}/posts`)
}

export const createPost = async (post: Post) : Promise<ResponseOrError<boolean>> => {
    try {
        const req = await fetch(`/api/posts`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
        if (!req.ok) {
            const json = req.json()
            return json as unknown as ServerError
        }
        return req.ok
    } catch (e) {
        if (e instanceof Error) {
            console.log("Unhandled error:", e.name, e.message)
            return {error: e.message}
        }
        console.log("Unknown exception thrown")
        return {error: "Unknown exception thrown"}
    }
}