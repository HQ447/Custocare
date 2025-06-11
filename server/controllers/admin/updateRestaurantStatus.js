import Restaurant from "../../models/Restaurant.js";

export const updateRestaurantStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.json({ message: "Rest Not found" });

    restaurant.status = status;

    restaurant.save();

    return res.json({ message: "Restaurant status updated Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
