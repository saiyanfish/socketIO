import { IfAny } from "mongoose";
import AppError from "../error/appError";
import catchAsync from "../error/catchAsync";
import User from "../model/account";
import Room from "../model/room";
import { Request, Response, NextFunction } from "express";
import CustomRequest from "../utils/userInterface";

const createSingleChatRoom = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { newfriend } = req.body;
  if (!newfriend) {
    return next(new AppError("gg", 400));
  }
  // userIds.sort();
  if (!(await User.findById(newfriend))) {
    return next(new AppError("mo this id", 400));
  }
  let userIds = [req.user.id, newfriend];
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
  let rooms = await Room.find({ $or: [{ user1: req.user.id }, { user2: req.user.id }] })
    .select({ user1: 1, user2: 1, _id: 1 })
    .populate({
      path: "user1",
      select: "-password",
    })
    .populate({
      path: "user2",
      select: "-password",
    });
  let name;
  let data = rooms.map((x: any) => {
    if (x.user1._id.toString() === req.user.id) {
      name = x.user1.name;
      return { room: x._id, friend: x.user2 };
    } else {
      name = x.user2.name;
      return { room: x._id, friend: x.user1 };
    }
  });
  res.status(200).json({ rooms: data, user: req.user.id, name });
});

export { createSingleChatRoom, findRoom, findUserRooms };
