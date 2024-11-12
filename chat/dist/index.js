"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("redis");
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const corsOptions = {
    // Note: need to expand this for instareddit
    origin: ["localhost:5173"]
};
// note: express might not be needed at all, but we use it for cors currently
const exp = (0, express_1.default)();
exp.use((0, cors_1.default)(corsOptions));
exp.get('/', (_req, res) => {
    res.json({ "message": "Hello, world!" });
});
// redis connection
const redisClient = (0, redis_1.createClient)({
    socket: {
        // note: need to have version for render redis/amazon elasticsotrage
        host: "chatlog"
    },
    // need to have version for render
    username: "instareddit",
    password: "secret",
    database: 0,
});
redisClient.on("connection", conn => console.log("Connected", conn));
redisClient.on("error", error => console.error("redis client error", error));
redisClient.connect().then(() => console.log("connected to redis client"))
    .catch(err => console.error("Failed to connect:", err));
const server = http_1.default.createServer(exp);
//function to generate room name based on users' ids
function getChatName(userId1, userId2) {
    return (userId1 > userId2) ? `${userId1}-${userId2}-chat` : `${userId2}-${userId1}-chat`;
}
//verifies the token and throws error if failed
function verifyToken(token) {
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY);
    return decodedToken;
}
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3030', "http://localhost:5173", "http://172.25.0.6:5173"], //used this for testing
        methods: ['GET', 'POST']
    }
});
//authorization
io.use((socket, next) => {
    //try to verify the token, if failed send connect_error with the error message
    try {
        const decodedToken = verifyToken(socket.handshake.auth.token);
        socket.data.userID = decodedToken.id;
        socket.data.username = decodedToken.username;
        next();
    }
    catch (error) {
        throw next(error);
    }
});
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get friends' IDs
    const response = yield fetch("http://backend:8000/api/friends", {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${socket.handshake.auth.token}`, // Add the Authorization header
            'Content-Type': 'application/json',
        },
    });
    // if request to django fails, send connect_error with the error message
    if (!response.ok) {
        const error = new Error(`HTTP error when requesting friends' ID's. Status: ${response.status}`);
        throw next(error);
    }
    //store the friends' id's and proceed to connection
    const data = yield response.json();
    socket.data.friends = data.friendsIds;
    next();
}));
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    //save client's user ID & friends list
    const userId = socket.data.userID;
    const friendsIds = socket.data.friends;
    socket.join(socket.data.userID.toString());
    console.log(`CLIENT CONNECTED, ID: ${userId}`);
    //send restored chats with each friend
    if (friendsIds) {
        const restoredMessages = yield Promise.all(friendsIds === null || friendsIds === void 0 ? void 0 : friendsIds.map((fId) => __awaiter(void 0, void 0, void 0, function* () {
            let chatName = getChatName(userId, fId);
            let prevMessages = (yield redisClient.lRange(`logs:${chatName}`, 0, -1));
            return { "withUser": fId, "messages": prevMessages.map(msg => JSON.parse(msg)) };
        })));
        // friendsIds?.forEach(async (fId: number) => {
        //     let chatName = getChatName(userId, fId)
        //     let prevMessages = await redisClient.lRange(`logs:${chatName}`, 0, -1)
        //     io.to(socket.data.userID.toString()).emit('restoredMessages', { "withUser": fId, "messages": prevMessages })
        // });
        io.to(socket.data.userID.toString()).emit('restoredMessages', restoredMessages);
    }
    //map user id to socket id
    yield redisClient.hSet('user-socket-map', userId, socket.id);
    //handle incoming message
    socket.on('message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, message }) {
        //verify message format
        if (!to || !message) {
            return console.error('Invalid message format: must be { to, message }');
        }
        //save message to logs
        const chatName = getChatName(userId, to);
        const messageLog = JSON.stringify({ "from": userId, "to": to, "message": message });
        yield redisClient.rPush(`logs:${chatName}`, messageLog);
        //get receiver's socketID
        const otherSocketId = yield redisClient.hGet('user-socket-map', `${to}`);
        if (otherSocketId === null) {
            return;
        }
        //send message to receiver
        const content = { 'from': userId, 'message': message };
        socket.to(`${otherSocketId}`).emit('message', content);
    }));
}));
server.listen(process.env.PORT, () => {
    console.log("Server started on", process.env.PORT);
});
//# sourceMappingURL=index.js.map