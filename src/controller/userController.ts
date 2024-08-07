import User from "../model/account";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../error/catchAsync";
import AppError from "../error/appError";
import CustomRequest from "../utils/userInterface";

function createAndSendToken(res: Response, user: any, statusCode: number) {
  const uid = user._id;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN || "",
  });
  const cookieOptions = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "succeess",
    data: {
      user,
    },
  });
}

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError("Plz provide the entire fomrmation", 400));
  }
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  createAndSendToken(res, newUser, 201);
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("plz enter the correct account and password", 404));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("no this account", 404));
  }
  if (!user.checkPassword(password, user.password)) {
    return next(new AppError("no this ", 404));
  }
  createAndSendToken(res, user, 200);
});

const isLogin = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) return next(new AppError("piz login", 401));
  const jwtDecode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  let user = await User.findById(jwtDecode.id);
  req.user = user;
  next();
});

export { createUser, login, isLogin };
