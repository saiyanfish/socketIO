"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Room schema
const roomSchema = new mongoose_1.Schema({
    user1: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    createTime: { type: Date, default: Date.now },
});
roomSchema.index({ user1: 1, user2: 1 }, { unique: true });
// Create the Room model
const Room = (0, mongoose_1.model)("Room", roomSchema);
exports.default = Room;
