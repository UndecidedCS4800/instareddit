import express from "express";
import http from "http"
import mariadb from "mariadb"
import cors, { CorsOptions } from "cors"
import { createClient as createRedisClient } from "redis"
import { DefaultEventsMap, Server } from "socket.io"
import jwt, { JwtPayload } from 'jsonwebtoken';

const corsOptions: CorsOptions = {
    // Note: need to expand this for instareddit
    origin: ["localhost:5173"]
}

// note: express might not be needed at all, but we use it for cors currently
const exp = express()
exp.use(cors(corsOptions))
exp.get('/', (_req, res) => {
    res.json({"message": "Hello, world!"})
})

// redis connection
const redisClient = createRedisClient({
    socket: {
        // note: need to have version for render redis/amazon elasticsotrage
        host: "chatlog"
    },

    // need to have version for render
    username: "instareddit",
    password: "secret",
    database: 0,
})

redisClient.on("connection", conn => console.log("Connected", conn))
redisClient.on("error", error => console.error("redis client error", error))

redisClient.connect().then(() => console.log("connected to redis client"))
                     .catch(err => console.error("Failed to connect:", err))


// mariadb connection
const pool = mariadb.createPool({
    // note: need version for render/production
    host: "db",
    user: "root",
    password: "secret",
    database: "dummy",
})

pool.getConnection().then(_conn => console.log("Connected to MariaDB"))
                    .catch(err => console.error("Failed to connect:", err))
const server = http.createServer(exp)

//socket.io
// types
interface ServerToClientEvents {
    message: (message: {from: number, message: string}) => void;
    restoredMessages: (msgs: { withUser: number, messages: string[] }) => void;
}


interface ClientToServerEvents {
    message: (message: { to: number, message: string }) => void;
}

interface SocketData {
    userID: number
    username: string
    friends?: number[]
}

//function to generate room name based on users' ids
function getChatName(userId1: string | number, userId2: string | number) {
    return (userId1 > userId2) ? `${userId1}-${userId2}-chat` : `${userId2}-${userId1}-chat`
}

//verifies the token and throws error if failed
function verifyToken(token: string) {
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY as string) as { username: string, id: number }
    return decodedToken
}

const io = new Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3030'], //used this for testing
        methods: ['GET', 'POST']
    }
})


//authorization

io.use((socket, next) => {
    //try to verify the token, if failed send connect_error with the error message
    try {
        const decodedToken = verifyToken(socket.handshake.auth.token)
        socket.data.userID = decodedToken.id
        socket.data.username = decodedToken.username
        next()

    } catch (error) {
        throw next(error as Error)
    }
})

io.use(async (socket, next) => {
    //get friends' IDs
    const response = await fetch("http://backend:8000/api/friends", { //change url later, for some reason localhost didn't work here, gotta use the container name
        method: 'GET',
        headers: {
            'Authorization': `bearer ${socket.handshake.auth.token}`, // Add the Authorization header
            'Content-Type': 'application/json',
        },
    }) 
    // if request to django fails, send connect_error with the error message
    if (!response.ok) {
        const error =  new Error(`HTTP error when requesting friends' ID's. Status: ${response.status}`);
        throw next(error);
    }
    //store the friends' id's and proceed to connection
    const data = await response.json();
    socket.data.friends = data.friendsIds;
    next()
})

io.on('connection', async (socket) => {
    //save client's user ID & friends list
    const userId = socket.data.userID
    const friendsIds = socket.data.friends

    console.log(`CLIENT CONNECTED, ID: ${userId}`)

    //send restored chats with each friend
    friendsIds?.forEach(async (fId: number) => {
        let chatName = getChatName(userId, fId)
        let prevMessages = await redisClient.lRange(`logs:${chatName}`, 0, -1)
        socket.emit('restoredMessages', { "withUser": fId, "messages": prevMessages })
    });

    //map user id to socket id
    await redisClient.hSet('user-socket-map', userId, socket.id)

    //handle incoming message
    socket.on('message', async ({ to, message }) => {

        //verify message format
        if (!to || !message) {
            return console.error('Invalid message format: must be { to, message }')
        }

        //save message to logs
        const chatName = getChatName(userId, to)
        const messageLog = JSON.stringify({ "from": userId, "to": to, "message": message})
        await redisClient.rPush(`logs:${chatName}`, messageLog)
        
        //get receiver's socketID
        const otherSocketId = await redisClient.hGet('user-socket-map', `${to}`)
        if (otherSocketId === null) {
            return
        }

        //send message to receiver
        const content = { 'from': userId, 'message': message }
        socket.to(`${otherSocketId}`).emit('message', content)
    }) 
})

server.listen(process.env.PORT, () => {
    console.log("Server started on", process.env.PORT)
})
