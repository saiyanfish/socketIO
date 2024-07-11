"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authRouter = (0, express_1.Router)();
authRouter.post("/signup", userController_1.createUser).post("/login", userController_1.login);
exports.default = authRouter;
