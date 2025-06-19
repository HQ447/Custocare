import Restaurant from "../../models/Restaurant.js";

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    await Restaurant.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
