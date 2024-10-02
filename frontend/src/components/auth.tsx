
import { createContext, useContext, useReducer } from "react"
import { JWTTokenResponse } from "../schema"

const authContext = createContext<JWTTokenResponse | null>(null);
const authDispatchContext = createContext<React.Dispatch<AuthAction>>(() => null)

type AuthAction = { type: "login", payload: JWTTokenResponse } | { type: "logout" }

export const useAuth = () => {
    return useContext(authContext)
}

export const useAuthDispatch = () => {
    return useContext(authDispatchContext)
}

export const AuthProvider = ( {children}: {children: React.ReactNode}) => {
    const [login, dispatch] = useReducer(reducer, initialLogin());

    return (
        <authContext.Provider value={login}>
            <authDispatchContext.Provider value={dispatch}>
                {children}
            </authDispatchContext.Provider>
        </authContext.Provider>
    )
}

const token = localStorage.getItem("token")
const username = localStorage.getItem("username")
const userid = localStorage.getItem("userid")

const initialLogin = (): JWTTokenResponse | null => (token && username && userid) ? { token, username, userid: Number(userid) } : null
const reducer = (_login: JWTTokenResponse | null, action: AuthAction) => {
    switch (action.type) {
        case "login":
            localStorage.setItem("token", action.payload.token)
            localStorage.setItem("username", action.payload.username)
            localStorage.setItem("userid", action.payload.userid.toString())
            return action.payload
        case "logout":
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("userid")
            return null
    }
    
}