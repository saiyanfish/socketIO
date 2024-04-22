import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("subscribed", (room) => {
    socket.join(room);
    console.log(`a new user join room ${room}`);
  });
  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.to(data.room).emit("message", data.message);
  });
  socket.on("disconnect", (data) => {
    console.log(data);
  });
});

server.listen(8888, () => {
  console.log("server started !!");
});
