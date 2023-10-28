import mongoose from "mongoose";

const loginUserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true],
    },
    email: {
      type: String,
      required: [true],
      unique: true,
    },
    password: {
      type: String,
      required: [true],
    },
    resetPasswordToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const LoginUser = mongoose.model("LoginUser", loginUserSchema);
export default LoginUser;
