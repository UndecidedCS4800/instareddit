import express from "express";
import http from "http"
import mariadb from "mariadb"
import cors, { CorsOptions } from "cors"
import { createClient as createRedisClient } from "redis"
import { DefaultEventsMap, Server } from "socket.io"
import jwt, { JwtPayload } from 'jsonwebtoken';

const BACKEND_URL = `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}`
const REDIS_URL = `${process.env.REDIS_URL}`
const corsOptions: CorsOptions = {
    // Note: need to expand this for instareddit
    origin: ["localhost:5173", "instareddit-1.onrender.com:443", "https://instareddit-1.onrender.com:443"]
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


    // // need to have version for render
    // username: "instareddit",
    // password: "secret",
    // database: 0,
    // url: REDIS_URL,
})

redisClient.on("connection", conn => console.log("Connected", conn))
redisClient.on("error", error => console.error("redis client error", error))

redisClient.connect().then(() => console.log("connected to redis client"))
                     .catch(err => console.error("Failed to connect:", err))


const server = http.createServer(exp)

interface ChatMessage {
    from: number,
    to: number,
    message: string,
}

interface User {
    id: number,
    username: string,
}
//socket.io
// types
interface ServerToClientEvents {
    message: (message: {from: number, message: string}) => void;
    restoredMessages: (msgs: { withUser: number, messages: ChatMessage[] }[]) => void;
}

interface ClientToServerEvents {
    message: (message: { to: User, message: string }) => void;
}

interface SocketData {
    userID: number
    username: string
    friends?: { id: number, username: string }[]
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
        origin: ['http://localhost:3000', 'http://localhost:3030', "http://localhost:5173", "http://172.25.0.6:5173", "https://instareddit-1.onrender.com", "https://instareddit-1.onrender.com:443"], //used this for testing
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
        console.log("authorization failed")
        if (error instanceof Error) {
        console.log(error.message)

        }
        throw next(error as Error)
    }
})

io.use(async (socket, next) => {
    //get friends' IDs
    try {
        const response = await fetch(`http://backend:8000/api/friends`, { //change url later, for some reason localhost didn't work here, gotta use the container name
            method: 'GET',
            headers: {
                'Authorization': `bearer ${socket.handshake.auth.token}`, // Add the Authorization header
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json();
        socket.data.friends = data.friends;
        next()
        // if request to django fails, send connect_error with the error message
        if (!response.ok) {
            const error = new Error(`HTTP error when requesting friends' ID's. Status: ${response.status}`);
            throw next(error);
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            next(e)
        }
    }
    //store the friends' id's and proceed to connection
})

io.on('connection', async (socket) => {
    //save client's user ID & friends list
    const userId = socket.data.userID
    const friendsIds = socket.data.friends
    socket.join(socket.data.userID.toString())
    console.log(`CLIENT CONNECTED, ID: ${userId}, ${socket.id}`)


    //send restored chats with each friend
    if (friendsIds) {
        try {
            const restoredMessages = await Promise.all(friendsIds.map(async ({id, username}: {id: number, username: string}) => {
                let chatName = getChatName(userId, id)
                let prevMessages = (await redisClient.lRange(`logs:${chatName}`, 0, -1))

                return { "withUser": id, "messages": prevMessages.map(msg => JSON.parse(msg)) }
            }));

            // friendsIds?.forEach(async (fId: number) => {
            //     let chatName = getChatName(userId, fId)
            //     let prevMessages = await redisClient.lRange(`logs:${chatName}`, 0, -1)
            //     io.to(socket.data.userID.toString()).emit('restoredMessages', { "withUser": fId, "messages": prevMessages })
            // });

            io.to(socket.data.userID.toString()).emit('restoredMessages', restoredMessages)
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message)
            }
        }
    }
    //map user id to socket id
    try {
        await redisClient.hSet('user-socket-map', userId, socket.id)
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
        }
    }

    //handle incoming message
    socket.on('message', async ({ to, message }) => {
        console.log("message",message)
        //verify message format
        if (!to || !message) {
            return console.error('Invalid message format: must be { to, message }')
        }
        console.log(message)

        //save message to logs
        const chatName = getChatName(userId, to.id)
        const messageLog = JSON.stringify({ "from": userId, "to": to.id, "message": message })
        try {
        await redisClient.rPush(`logs:${chatName}`, messageLog)
        } catch(e) {
            if (e instanceof Error) {
                console.log(e)
            }
        }
        
        //get receiver's socketID
        try {
            const otherSocketId = await redisClient.hGet('user-socket-map', `${to.id}`)
            if (otherSocketId === null) {
                return
            }
            
        const content: Omit<ChatMessage, "to"> = { 'from': userId, 'message': message }
        socket.to(`${otherSocketId}`).emit('message', content)
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message)
            }
        }

        //send message to receiver
    }) 
})

server.listen(process.env.PORT, () => {
    console.log("Server started on", process.env.PORT)
})
