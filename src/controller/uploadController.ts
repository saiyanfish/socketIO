import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";
import sharp from "sharp";
const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new MulterError("LIMIT_UNEXPECTED_FILE", "File is not an image"));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadFile = upload.fields([
  {
    name: "images",
    maxCount: 3,
  },
]);

export const reszieImages = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.files.images) return next();
  req.body.images = ["1", "2", "3"];
  Promise.all(
    req.files.images.map(async (file: Express.Multer.File, i: number) => {
      sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .toFile(`./image/${file.filename}`);
      req.body.images.push(file.filename);
    })
  );
  next();
};

export const updateMongo = async () => {};
