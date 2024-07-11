"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controller/roomController");
const roomRouter = (0, express_1.Router)();
roomRouter.post("/add", roomController_1.createSingleChatRoom).post("/getRoom", roomController_1.findRoom);
exports.default = roomRouter;
