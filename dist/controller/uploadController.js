"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMongo = exports.reszieImages = exports.uploadFile = void 0;
const multer_1 = __importStar(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new multer_1.MulterError("LIMIT_UNEXPECTED_FILE", "File is not an image"));
    }
};
const upload = (0, multer_1.default)({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadFile = upload.fields([
    {
        name: "images",
        maxCount: 3,
    },
]);
const reszieImages = async (req, res, next) => {
    if (!req.files.images)
        return next();
    req.body.images = ["1", "2", "3"];
    Promise.all(req.files.images.map(async (file, i) => {
        (0, sharp_1.default)(file.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 100 })
            .toFile(`./image/${file.filename}`);
        req.body.images.push(file.filename);
    }));
    next();
};
exports.reszieImages = reszieImages;
const updateMongo = async () => { };
exports.updateMongo = updateMongo;
