import express from "express";
import http from "http"
import mariadb from "mariadb"
import cors, { CorsOptions } from "cors"
import { createClient as createRedisClient } from "redis"
import { Server } from "socket.io"

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

//socket.io
const io = new Server(server)
io.on('connection', (socket) => {
    //allow to join chat between two users

    //get username of whoever is connected and room ID from query params
    const { username } = socket.handshake.query;
    
    //join room for chat between 2 users (frontend can decide how to specify room ID's)
    socket.on('joinRoom', async ({roomId}) => {
        socket.join(roomId)
        //get and emit previous messages in this room
        const messages = await redisClient.lRange(`messages:${roomId}`, 0, -1)
        socket.emit('previousMessages', messages)
    })

    //emit any messages received back to the the Room and save them to redis
    socket.on('message', async ({roomId, text}) => {
        if (!roomId) {
            return
        }
        const message = `${username}: ${text}`
        //emit new message to the room
        io.to(roomId).emit('message', message)
        //store message in db
        await redisClient.rPush(`messages:${roomId}`, message)
    })

    socket.on('leaveRoom', ({roomId}) => {
        socket.leave(roomId)
    })
})

server.listen(process.env.PORT, () => {
    console.log("Server started on", process.env.PORT)
})

