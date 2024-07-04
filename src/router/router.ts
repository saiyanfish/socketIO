import { Router } from "express";
import { createUser, login } from "../controller/userController";
const authRouter = Router();

authRouter.post("/signup", createUser).post("/login", login);

export default authRouter;
