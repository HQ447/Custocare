// controllers/restaurantController.js
import Restaurant from "../models/Restaurant.js";

export const getNearbyRestaurants = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
      return res
        .status(400)
        .json({ success: false, message: "Coordinates are required" });
    }

    const restaurants = await Restaurant.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // 1km
        },
      },
      status: "Approved", // Optional: Only show approved restaurants
    });

    res.json({ success: true, restaurants });
  } catch (err) {
    console.error("Error finding nearby restaurants:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
