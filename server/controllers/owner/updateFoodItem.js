import Food from "../../models/Food.js";

export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await Food.findById(id);
    if (!existingItem) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }

    const { foodName, description, oldPrice, newPrice } = req.body;

    // Update fields if they exist in the request
    if (foodName) existingItem.foodName = foodName;
    if (description) existingItem.description = description;
    if (oldPrice) existingItem.oldPrice = Number(oldPrice);
    if (newPrice) existingItem.newPrice = Number(newPrice);

    // If a new image is uploaded
    if (req.file) {
      const imageUrl = req.file.path || req.file.location; // local | Cloudinary | S3
      existingItem.img = imageUrl;
    }

    const updatedFood = await existingItem.save();

    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      item: updatedFood,
    });
  } catch (error) {
    console.error("Update Food Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
