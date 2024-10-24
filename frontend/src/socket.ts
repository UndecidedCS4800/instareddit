import io from "socket.io-client"

// change for production

const URL = `${import.meta.env.VITE_CHAT_URL}:${import.meta.env.VITE_CHAT_PORT}`
const options = {
    autoConnect: false,
}

const socket = io(URL, options)

interface Authorized extends SocketIOClient.Socket {
    auth?: {
        token: string
    }
}

const auth: Authorized = socket;
export default auth