"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRoom = exports.createSingleChatRoom = void 0;
const appError_1 = __importDefault(require("../error/appError"));
const catchAsync_1 = __importDefault(require("../error/catchAsync"));
const room_1 = __importDefault(require("../model/room"));
const createSingleChatRoom = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userIds } = req.body;
    if (!userIds || userIds.length < 2) {
        return next(new appError_1.default("gg", 400));
    }
    userIds.sort();
    const room = await room_1.default.create({ user1: userIds[0], user2: userIds[1], createTime: new Date(Date.now()) });
    res.status(201).json({ room });
});
exports.createSingleChatRoom = createSingleChatRoom;
const findRoom = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id, friendId } = req.body;
    if (!id || !friendId) {
        return next(new appError_1.default("Missing data: id or friendId", 404));
    }
    if (req.cookies && req.cookies[friendId]) {
        console.log("from cookie");
        return res.status(200).json({ room: req.cookies[friendId] });
    }
    const arr = [id, friendId].sort();
    let room = await room_1.default.findOne({ user1: arr[0], user2: arr[1] });
    if (!room) {
        room = await room_1.default.create({ user1: arr[0], user2: arr[1], createTime: new Date(Date.now()) });
    }
    res.cookie(friendId, room.id, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 3,
    });
    res.status(200).json({ room: room.id });
});
exports.findRoom = findRoom;
