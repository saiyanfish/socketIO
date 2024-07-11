"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "room",
    },
    createTime: {
        type: Date,
    },
    message: {
        type: String,
    },
});
const Message = (0, mongoose_1.model)("Message", MessageSchema, "message");
exports.default = Message;
