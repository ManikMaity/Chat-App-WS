"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const ws_1 = require("ws");
const server_config_1 = require("./config/server.config");
const express_1 = __importDefault(require("express"));
const functions_1 = require("./utils/functions");
const resposneMessage_1 = require("./config/resposneMessage");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a, _b;
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "join") {
            if (!((_a = parsedMessage === null || parsedMessage === void 0 ? void 0 : parsedMessage.payload) === null || _a === void 0 ? void 0 : _a.roomId)) {
                socket.send((0, functions_1.createResponseMessage)(false, resposneMessage_1.ERROR_MESSAGE, { message: "Room id is required" }));
                return;
            }
            const exit = allSockets.find((user) => user.socket === socket);
            if (exit) {
                if (exit.room == parsedMessage.payload.roomId) {
                    socket.send((0, functions_1.createResponseMessage)(false, resposneMessage_1.ERROR_MESSAGE, { messaege: `You are already in room ${exit.room}` }));
                    return;
                }
                const filtered = allSockets.filter((user) => user.socket !== socket);
                allSockets = filtered;
            }
            allSockets.push({ socket, room: parsedMessage.payload.roomId });
            socket.send((0, functions_1.createResponseMessage)(true, resposneMessage_1.JOIN_MESSAGE, { message: `Joined room ${parsedMessage.payload.roomId}` }));
        }
        if (parsedMessage.type === "chat") {
            if (!((_b = parsedMessage === null || parsedMessage === void 0 ? void 0 : parsedMessage.payload) === null || _b === void 0 ? void 0 : _b.message)) {
                socket.send((0, functions_1.createResponseMessage)(false, resposneMessage_1.ERROR_MESSAGE, { message: "Message is required" }));
                return;
            }
            const user = allSockets.find((user) => user.socket === socket);
            if (!user) {
                socket.send((0, functions_1.createResponseMessage)(false, resposneMessage_1.ERROR_MESSAGE, { message: "You are not in a room" }));
            }
            const usersInRoom = allSockets.filter((other) => (user === null || user === void 0 ? void 0 : user.room) === other.room);
            usersInRoom.forEach((user) => {
                user.socket.send((0, functions_1.createResponseMessage)(true, resposneMessage_1.CHAT_MESSAGE, {
                    message: parsedMessage.payload.message,
                }));
            });
        }
    });
    socket.on("close", () => {
        const exit = allSockets.find((user) => user.socket === socket);
        if (exit) {
            const filtered = allSockets.filter((user) => user.socket !== socket);
            allSockets = filtered;
            socket.send((0, functions_1.createResponseMessage)(true, resposneMessage_1.LEAVE_MESSAGE, { message: `Left room ${exit.room}` }));
        }
    });
});
console.log(allSockets);
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});
server.listen(server_config_1.PORT, () => {
    console.log(`Server started on port https://localhost:${server_config_1.PORT}`);
});
