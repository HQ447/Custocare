import Food from "../../models/Food.js";

export const getFoods = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const foods = await Food.find({ restaurantId });
    res.status(200).json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
