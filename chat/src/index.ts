import express from "express";
import http from "http"
import mariadb from "mariadb"
import cors, { CorsOptions } from "cors"
import { createClient as createRedisClient } from "redis"

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
    database: "dummy" 
})

pool.getConnection().then(_conn => console.log("Connected to MariaDB"))
                    .catch(err => console.error("Failed to connect:", err))
const server = http.createServer(exp)

server.listen(process.env.PORT, () => {
    console.log("Server started on", process.env.PORT)
})

