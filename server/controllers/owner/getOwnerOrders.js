import Order from "../../models/Order.js";
import Restaurant from "../../models/Restaurant.js";

export const getOwnerOrders = async (req, res) => {
  try {
    const ownerId = req.user.id; // assuming owner is authenticated

    // Step 1: Get all restaurant IDs owned by this owner
    const restaurants = await Restaurant.find({ ownerId }, "_id");
    const restaurantIds = restaurants.map((r) => r._id);

    if (restaurantIds.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found for this owner." });
    }

    // Step 2: Find orders that include any items from these restaurants
    const orders = await Order.find({
      "items.restaurantId": { $in: restaurantIds },
    });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching owner orders:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
