import User from "../../models/User.js";

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findById(id);

    if (!user) return res.json({ message: "user not found" });

    await User.findByIdAndDelete(id);

    res.json({ message: "user deleted successfully" });
  } catch (error) {
    console.log("error in deleting user");
    res.json({ message: "error in deleting user", error });
  }
};
