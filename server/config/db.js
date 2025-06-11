import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected Successfully!!!");
  } catch (error) {
    console.log("error in connecting MongoDB:::", error);
  }
};

export default connectDB;
