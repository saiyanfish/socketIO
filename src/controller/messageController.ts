import catchAsync from "../error/catchAsync";
import Message from "../model/message";
import { isLogin } from "./userController";
import CustomRequest from "../utils/userInterface";
import AppError from "../error/appError";
import mongoose from "mongoose";
import { findRoom } from "./roomController";

const sendMessage = catchAsync(async (req: CustomRequest, res, next) => {
  const user = req.user;
  let { message, receiver } = req.body;
  let room = await findRoom(user.id, receiver, next);
  if (message === undefined) return next(new AppError("no args", 400));
  let msg = await Message.create({ message: message, sender: req.user.id, receiver: receiver, createTime: new Date(), room: room.id });
  res.status(200).json({ msg });
});

const unreadAmount = catchAsync(async (req: CustomRequest, res, next) => {
  const user = req.user;
  const data = await Message.aggregate([
    {
      $match: {
        receiver: req.user._id,
      },
    },
    {
      $sort: { createTime: -1 },
    },
    {
      $group: {
        _id: "$sender",
        unreadCount: {
          $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] },
        },
        readCount: {
          $sum: { $cond: [{ $eq: ["$read", true] }, 1, 0] },
        },
        newestMsg: {
          $first: "$message",
        },
      },
    },
  ]);
  res.status(200).json({ data });
});

const messageHistory = catchAsync(async (req: CustomRequest, res, next) => {
  const user = req.user;
  let { friendId } = req.body;
  if (!friendId) res.status(200).json({});

  await Message.updateMany({ receiver: user.id, sender: friendId }, { $set: { read: true } });
  const messages = await Message.find({
    $or: [
      { receiver: user.id, sender: friendId },
      { receiver: friendId, sender: user.id },
    ],
  }).sort({ createTime: -1 });
  res.status(200).json({ data: messages });
});

export { sendMessage, messageHistory, unreadAmount };
