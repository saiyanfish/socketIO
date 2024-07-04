"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "public", "io.html"));
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
