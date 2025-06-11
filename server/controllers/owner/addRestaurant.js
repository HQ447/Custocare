import Restaurant from "../../models/Restaurant.js";

export const addRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Parse fields from formData
    const { restaurantName, description, address } = req.body;
    const coordinates = JSON.parse(req.body.coordinates); // Expecting GeoJSON: { type: "Point", coordinates: [lng, lat] }

    // Cloudinary image URL (assumes middleware sets req.file.path or req.file.secure_url)
    const img = req.file?.path || req.file?.secure_url;

    if (!img) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required." });
    }

    const newRestaurant = new Restaurant({
      ownerId,
      restaurantName,
      description,
      address,
      img,
      coordinates, // Matches your schema
    });

    await newRestaurant.save();

    res.status(201).json({ success: true, restaurant: newRestaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
    console.log("err");
  }
};
