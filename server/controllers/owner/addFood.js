// controllers/foodController.js
import Food from "../../models/Food.js";

export const addFood = async (req, res) => {
  try {
    const { foodName, description, oldPrice, newPrice, restaurantId } =
      req.body;
    const img = req.file?.path; // from image upload middleware (Cloudinary URL)

    if (!foodName || !description || !restaurantId || !img) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newFood = new Food({
      restaurantId,
      foodName,
      description,
      oldPrice,
      newPrice,
      img,
    });

    await newFood.save();
    res.status(201).json({ success: true, food: newFood });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
