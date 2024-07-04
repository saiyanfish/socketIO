import AppError from "../error/appError";
import catchAsync from "../error/catchAsync";
import User from "../model/account";
import Room from "../model/room";
import { Request, Response, NextFunction } from "express";

const createSingleChatRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length < 2) {
    return next(new AppError("gg", 400));
  }
  userIds.sort();
  const room = await Room.create({ user1: userIds[0], user2: userIds[1], createTime: new Date(Date.now()) });
  res.status(201).json({ room });
});

const findRoom = catchAsync(async (req, res, next) => {
  const { id, friendId } = req.body;

  if (!id || !friendId) {
    return next(new AppError("Missing data: id or friendId", 404));
  }

  if (req.cookies && req.cookies[friendId]) {
    console.log("from cookie");
    return res.status(200).json({ room: req.cookies[friendId] });
  }

  const arr = [id, friendId].sort();
  let room = await Room.findOne({ user1: arr[0], user2: arr[1] });

  if (!room) {
    room = await Room.create({ user1: arr[0], user2: arr[1], createTime: new Date(Date.now()) });
  }
  res.cookie(friendId, room.id, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 3,
  });
  res.status(200).json({ room: room.id });
});

export { createSingleChatRoom, findRoom };
