import Food from "../../models/Food.js";

export const getFoodItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Food.findById(id);
    res.status(200).json({ message: "item fetched", item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
