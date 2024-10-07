import express from "express";
import http from "http"
import mariadb from "mariadb"
import cors, { CorsOptions } from "cors"
import { createClient as createRedisClient } from "redis"
import { Server } from "socket.io"
import jwt, { JwtPayload } from 'jsonwebtoken';

const corsOptions: CorsOptions = {
    // Note: need to expand this for instareddit
    origin: ["localhost"]
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
    database: "milosz_dev" 
})

pool.getConnection().then(_conn => console.log("Connected to MariaDB"))
                    .catch(err => console.error("Failed to connect:", err))
const server = http.createServer(exp)

//function to generate room name based on users' ids
function getChatName(userId1: string, userId2: string) {
    return (userId1 > userId2) ? `${userId1}-${userId2}-chat` : `${userId2}-${userId1}-chat`
}

//socket.io
const io = new Server(server)
io.on('connection', async (socket) => {
    // get token from header
    const token = socket.handshake.headers.authorization?.split(' ')[1] as string;
    //decode token
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY as string) as { username: string, id: string }
    const userId: string = decodedToken.id

    //get friends' IDs
    const response = await fetch("http://backend:8000/api/friends", { //change url later, for some reason localhost didn't work here, gotta use the container name
        method: 'GET',
        headers: {
            'Authorization': `bearer ${token}`, // Add the Authorization header
            'Content-Type': 'application/json',
        },
    }) 
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const friendsIds: Array<string> = data.friendsIds

    //send restored chats with each friend
    friendsIds.forEach(async (fId: string) => {
        let chatName = getChatName(userId, fId)
        let prevMessages = await redisClient.lRange(`logs:${chatName}`, 0, -1)
        io.to(socket.id).emit('restoredMessages', { "with": fId, "messages": prevMessages })
    });

    //map user id to socket id
    await redisClient.hSet('user-socket-map', userId, socket.id)

    //handle incoming message
    socket.on('message', async ({ to, message }) => {
        //get receiver's socketID
        const otherSocketId = await redisClient.hGet('user-socket-map', `${to}`)
        if (otherSocketId === null) {
            console.log("Invalid recevier ID")
            return
        }

        //save message to logs
        const chatName = getChatName(userId, to)
        console.log(chatName)
        const messageLog = JSON.stringify({ "from": userId, "to": to, "message": message})
        await redisClient.rPush(`logs:${chatName}`, messageLog)

        //send message to receiver
        const content = { 'from': userId, 'message': message }
        socket.to(`${otherSocketId}`).emit('message', content)
    }) 
})

server.listen(process.env.PORT, () => {
    console.log("Server started on", process.env.PORT)
})

