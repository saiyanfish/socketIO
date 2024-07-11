import { IfAny } from "mongoose";
import AppError from "../error/appError";
import catchAsync from "../error/catchAsync";
import User from "../model/account";
import Room from "../model/room";
import { Request, Response, NextFunction } from "express";
import CustomRequest from "../utils/userInterface";

const createSingleChatRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length < 2) {
    return next(new AppError("gg", 400));
  }
  userIds.sort();
  const room = await Room.create({ user1: userIds[0], user2: userIds[1], createTime: new Date(Date.now()) });
  res.status(201).json({ room });
});

const findRoom: any = async function (id: string, friendId: string, next: NextFunction) {
  if (!id || !friendId) {
    return next(new AppError("Missing data: id or friendId", 404));
  }
  const arr = [id, friendId].sort();
  let room = await Room.findOne({ user1: arr[0], user2: arr[1] });
  if (!room) {
    room = await Room.create({ user1: arr[0], user2: arr[1], createTime: new Date(Date.now()) });
  }
  return room;
};

const findUserRooms = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
  let rooms = await Room.find({ $or: [{ user1: req.user.id }, { user2: req.user.id }] }).select({ user1: 1, user2: 1, _id: 1 });
  let data = rooms.map((x) => {
    if (x.user1.toString() === req.user.id) {
      return { room: x._id, friend: x.user2 };
    } else {
      return { room: x._id, friend: x.user1 };
    }
  });
  res.status(200).json({ rooms: data });
});

export { createSingleChatRoom, findRoom, findUserRooms };
