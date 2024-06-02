import { Server } from "socket.io";
import express from "express";
import http from "http";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "io.html"));
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
