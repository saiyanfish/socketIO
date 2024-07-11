"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const catchAsync_1 = __importDefault(require("../error/catchAsync"));
const sendMessage = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({ user });
});
exports.sendMessage = sendMessage;
