"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const messageController_1 = require("../controller/messageController");
const msgRouter = (0, express_1.Router)();
msgRouter.get("/send", userController_1.isLogin, messageController_1.sendMessage);
exports.default = msgRouter;
