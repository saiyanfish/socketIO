import { Model, Schema, model } from "mongoose";
interface IMessage {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  room: Schema.Types.ObjectId;
  createTime: Date;
  message: string;
  read: boolean;
}

type MessageModel = Model<IMessage>;

const MessageSchema = new Schema<IMessage, MessageModel, {}>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "room",
  },
  createTime: {
    type: Date,
  },
  message: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Message = model<IMessage, MessageModel>("Message", MessageSchema, "message");

export default Message;
