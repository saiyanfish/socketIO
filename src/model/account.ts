import { Model, Schema, model } from "mongoose";
import validator from "validator";
import bcrtpy from "bcryptjs";

interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  createdAt: number;
}

interface IUserMethods {
  checkPassword(password: string, candidcate: string): boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, "Plz provide the correct format !!"],
  },
  password: { type: String, required: true },
  passwordConfirm: { type: String },
  createdAt: { type: Number },
});

schema.index({ email: 1 });

schema.pre("save", async function passwordHash(next) {
  this.password = await bcrtpy.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

schema.method("checkPassword", async (password, candidcate) => {
  return await bcrtpy.compare(password, candidcate);
});

const User = model<IUser, UserModel>("User", schema, "user");

export default User;
