import { Router } from "express";
import { createSingleChatRoom, findUserRooms } from "../controller/roomController";
import { isLogin } from "../controller/userController";
const roomRouter = Router();

roomRouter.post("/add", isLogin, createSingleChatRoom).get("/rooms", isLogin, findUserRooms);
export default roomRouter;
