import Restaurant from "../../models/Restaurant.js";

export const updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const existingRestaurant = await Restaurant.findById(restaurantId);
    if (!existingRestaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    const { restaurantName, description, address, coordinates } = req.body;

    // Update fields
    if (restaurantName) existingRestaurant.restaurantName = restaurantName;
    if (description) existingRestaurant.description = description;
    if (address) existingRestaurant.address = address;
    if (coordinates) {
      const parsedCoordinates = JSON.parse(coordinates);
      if (Array.isArray(parsedCoordinates) && parsedCoordinates.length === 2) {
        existingRestaurant.coordinates = {
          type: "Point",
          coordinates: parsedCoordinates,
        };
      }
    } // coordinates sent as JSON string

    // Handle image update if new image uploaded
    if (req.file) {
      const imageUrl = req.file.path || req.file.location; // local | Cloudinary | S3
      existingRestaurant.img = imageUrl;
    }

    const updatedRestaurant = await existingRestaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
