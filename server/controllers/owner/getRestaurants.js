import Restaurant from "../../models/Restaurant.js";

export const getRestautants = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const restaurants = await Restaurant.find({ ownerId });
    res.status(200).json({ success: true, restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
