import { Server } from "socket.io";
import express from "express";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./router/router";
import roomRouter from "./router/roomRouter";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// config
dotenv.config({ path: "./config.env" });

app.use(express.json({}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "io.html"));
});

app.use("/user", authRouter);
app.use("/room", roomRouter);

// mongo Connect
const db = process.env.DATABASE?.replace("<PASSWORD>", process.env.DATABASE_PASSWORD || "");
async function connectToDatabase() {
  try {
    await mongoose.connect(db || "", {});
    console.log("Database connected");
  } catch (error) {
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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // console.log(err);
  res.status(400).json({ error: err.message });
});

// server
server.listen(8888, () => {
  console.log("server started !!");
});
