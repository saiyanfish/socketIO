"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogin = exports.login = exports.createUser = void 0;
const account_1 = __importDefault(require("../model/account"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../error/catchAsync"));
const appError_1 = __importDefault(require("../error/appError"));
function createAndSendToken(res, user, statusCode) {
  const uid = user._id;
  const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN || "",
  });
  const cookieOptions = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
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
const createUser = (0, catchAsync_1.default)(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return next(new appError_1.default("Plz provide the entire fomrmation", 400));
  }
  const newUser = await account_1.default.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  createAndSendToken(res, newUser, 201);
});
exports.createUser = createUser;
const login = (0, catchAsync_1.default)(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError_1.default("plz enter the correct account and password", 404));
  }
  const user = await account_1.default.findOne({ email });
  if (!user) {
    return next(new appError_1.default("no this account", 404));
  }
  if (!user.checkPassword(password, user.password)) {
    return next(new appError_1.default("no this ", 404));
  }
  createAndSendToken(res, user, 200);
});
exports.login = login;
const isLogin = (0, catchAsync_1.default)(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new appError_1.default("piz login", 401));
  const jwtDecode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
  let user = await account_1.default.findById(jwtDecode.id);
  req.user = user;
  next();
});
exports.isLogin = isLogin;
