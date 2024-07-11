import { Router } from "express";
import { isLogin } from "../controller/userController";
import { sendMessage, messageHistory, unreadAmount } from "../controller/messageController";

const msgRouter = Router();

msgRouter.post("/send", isLogin, sendMessage).post("/history", isLogin, messageHistory).get("/unread", isLogin, unreadAmount);

export default msgRouter;
