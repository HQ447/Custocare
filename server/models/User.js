import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["customer", "owner", "admin"],
      required: true,
      default: "customer",
    },
    password: { type: String, required: true },
    img: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
