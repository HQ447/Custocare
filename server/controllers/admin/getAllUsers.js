import User from "../../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.json({ message: "users not found" });

    res.json({ message: "User fetch successfully", users });
  } catch (error) {
    console.log("error in getting All users");
    res.json({ message: "error in getting all users" });
  }
};
