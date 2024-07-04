import { Router } from "express";
import { createSingleChatRoom, findRoom } from "../controller/roomController";

const roomRouter = Router();

roomRouter.post("/add", createSingleChatRoom).post("/getRoom", findRoom);
export default roomRouter;
