import catchAsync from "../error/catchAsync";
import Message from "../model/message";

const sendMessage = catchAsync(async (req, res, next) => {
  const { sender, receiver } = req.body;
});
