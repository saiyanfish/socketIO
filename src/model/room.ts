import { Schema, model, Types } from "mongoose";

interface IRoom extends Document {
  user1: Schema.Types.ObjectId;
  user2: Schema.Types.ObjectId;
  createTime: Date;
}
// Define the Room schema
const roomSchema = new Schema<IRoom>({
  user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createTime: { type: Date, default: Date.now },
});

roomSchema.index({ user1: 1, user2: 1 }, { unique: true });

// Create the Room model
const Room = model<IRoom>("Room", roomSchema);

export default Room;
