import Food from "../models/Food.js";

export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
