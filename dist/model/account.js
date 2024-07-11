"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator_1.default.isEmail, "Plz provide the correct format !!"],
    },
    password: { type: String, required: true },
    passwordConfirm: { type: String },
    createdAt: { type: Number },
});
schema.index({ email: 1 });
schema.pre("save", async function passwordHash(next) {
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
schema.method("checkPassword", async (password, candidcate) => {
    return await bcryptjs_1.default.compare(password, candidcate);
});
const User = (0, mongoose_1.model)("User", schema, "user");
exports.default = User;
