import io from "socket.io-client"

// change for production
const URL = "http://localhost:10000"
const options = {
    auth: {
        token: localStorage.getItem("token") || ""
    }
}

export const socket = io(URL, options)