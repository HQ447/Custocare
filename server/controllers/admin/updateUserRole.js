import User from "../../models/User.js";

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const user = await User.findById(id);

    if (!user) return res.json({ message: "user not found" });

    user.role = role;
    await user.save();

    res.json({ message: "user role updated successfully" });
  } catch (error) {
    console.log("Error in updating role", error);
    res.json({ message: "error in updating role", error });
  }
};
