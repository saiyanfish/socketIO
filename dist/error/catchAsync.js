"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("./appError"));
const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => {
        if (err.name === "MongoServerError")
            next(new appError_1.default(err.errorResponse.errmsg, 400));
        next(err);
    });
};
exports.default = catchAsync;
