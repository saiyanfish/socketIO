"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./router/router"));
const roomRouter_1 = __importDefault(require("./router/roomRouter"));
const messageRouter_1 = __importDefault(require("./router/messageRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
// config
dotenv_1.default.config({ path: "./config.env" });
app.use(express_1.default.json({}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "public", "io.html"));
});
app.use("/user", router_1.default);
app.use("/room", roomRouter_1.default);
app.use("/msg", messageRouter_1.default);
// mongo Connect
const db = (_a = process.env.DATABASE) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", process.env.DATABASE_PASSWORD || "");
async function connectToDatabase() {
    try {
        await mongoose_1.default.connect(db || "", {});
        console.log("Database connected");
    }
    catch (error) {
        console.error("Error connecting to database:", error);
    }
}
connectToDatabase();
// socketIo
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
app.use((err, req, res, next) => {
    // console.log(err);
    res.status(400).json({ error: err.message });
});
// server
server.listen(8888, () => {
    console.log("server started !!");
});
