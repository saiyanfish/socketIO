import { Request, Response, NextFunction } from "express";
import AppError from "./appError";

const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err): any => {
      if (err.name === "MongoServerError") next(new AppError(err.errorResponse.errmsg, 400));
      next(err);
    });
  };

export default catchAsync;
