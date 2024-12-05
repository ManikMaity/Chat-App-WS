import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { PORT } from "./config/server.config";
import express from "express";
import { createResponseMessage } from "./utils/functions";
import { CHAT_MESSAGE, ERROR_MESSAGE, JOIN_MESSAGE, LEAVE_MESSAGE } from "./config/resposneMessage";

const app = express();
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "join") {
      if (!parsedMessage?.payload?.roomId) {
        socket.send(createResponseMessage(false, ERROR_MESSAGE, {message: "Room id is required"}));
        return;
      }
      const exit = allSockets.find((user) => user.socket === socket);
      if (exit) {
        if (exit.room == parsedMessage.payload.roomId) {
          socket.send(
            createResponseMessage(false, ERROR_MESSAGE, { messaege: `You are already in room ${exit.room}`})
          );
          return;
        }
       const filtered = allSockets.filter((user) => user.socket !== socket);
        allSockets = filtered;
      }
      allSockets.push({ socket, room: parsedMessage.payload.roomId });
      socket.send(
        createResponseMessage(
          true,
          JOIN_MESSAGE,
          {message: `Joined room ${parsedMessage.payload.roomId}`}
        )
      );
    }

    if (parsedMessage.type === "chat") {
      if (!parsedMessage?.payload?.message) {
        socket.send(createResponseMessage(false, ERROR_MESSAGE, {message: "Message is required"}));
        return;
      }

      const user = allSockets.find((user) => user.socket === socket);
      if (!user) {
        socket.send(createResponseMessage(false, ERROR_MESSAGE, {message : "You are not in a room"}));
      }

      const usersInRoom = allSockets.filter(
        (other) => user?.room === other.room
      );

      usersInRoom.forEach((user) => {
        user.socket.send(
          createResponseMessage(true, CHAT_MESSAGE, {
            message: parsedMessage.payload.message,
          })
        );
      });
    }
  });

  socket.on("close", () => {
    const exit = allSockets.find((user) => user.socket === socket);
    if (exit) {
      const filtered = allSockets.filter((user) => user.socket !== socket);
      allSockets = filtered;
      socket.send(
        createResponseMessage(true, LEAVE_MESSAGE, {message : `Left room ${exit.room}`})
      );
    }
  });

});

console.log(allSockets);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

server.listen(PORT, () => {
  console.log(`Server started on port https://localhost:${PORT}`);
});
