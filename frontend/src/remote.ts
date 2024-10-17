import { Community, Friend, FriendResponse, JWTTokenResponse, PaginationResponse, Post, PostRequest, ServerError } from "./schema";

const URL = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}`;

const withAuth = (token: string, headers: HeadersInit): HeadersInit => ({
    "Authorization": `bearer ${token}`,
    ...headers
})

export type ResponseOrError<T> = T | ServerError;

// Function to register a new user
export const registerUser = async (username: string, email: string, password: string): Promise<ResponseOrError<JWTTokenResponse>> => {
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
            const errorData = (await response.json()) as ServerError;
            console.error('Error registering user:', response.status, response.statusText, errorData);
            return errorData
        }

        return await response.json() as JWTTokenResponse;
    } catch (e) {
        if (e instanceof Error) {
            console.log("Unhandled error:", e.name, e.message)
            return {error: e.message}
        }
        console.log("Unknown exception thrown")
        return {error: "Unknown exception thrown"}
    }
};

// Function to log a user in and store JWT
export const loginUser = async (username: string, password: string): Promise<ResponseOrError<JWTTokenResponse>> => {
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
            return errorData
        }

        const data = await response.json();

        return data as JWTTokenResponse;
    } catch (e) {
        if (e instanceof Error) {
            console.log("Unhandled error:", e.name, e.message)
            return {error: e.message}
        }
        console.log("Unknown exception thrown")
        return {error: "Unknown exception thrown"}
    }
};



async function get<T>(relative_path: string, token?: string): Promise<ResponseOrError<T>> {
    try {
        const baseHeaders = { 'Content-Type': "application/json" }
        const headers = token ? withAuth(token, baseHeaders) 
                        : baseHeaders
        const req = await fetch(`${URL}${relative_path}`, {
            headers
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

export const getFriends = async (token: string): Promise<ResponseOrError<Friend[]>> => {
    const json =  await get('/api/friends', token) as FriendResponse

    return json.friends
}

export const createPost = async (token: JWTTokenResponse['token'], post: PostRequest) : Promise<ResponseOrError<Post>> => {
    try {
        const req = await fetch(`${URL}/api/posts`, {
            method: "POST",
            headers: withAuth(token, {
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(post)
        })
        if (!req.ok) {
            const json = req.json()
            return json as unknown as ServerError
        }
        return await req.json()
    } catch (e) {
        if (e instanceof Error) {
            console.log("Unhandled error:", e.name, e.message)
            return {error: e.message}
        }
        console.log("Unknown exception thrown")
        return {error: "Unknown exception thrown"}
    }
}