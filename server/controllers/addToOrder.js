import Cart from "../models/Cart.js";

export const addToOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      _id,
      foodName,
      restaurantId,
      category,
      img,
      description,
      oldPrice,
      newPrice,
    } = req.body;

    const foodId = _id;

    const existingItem = await Cart.findOne({
      foodId,
    });

    if (existingItem) return res.json({ message: "item already exist" });

    const foodItem = new Cart({
      customerId,
      foodId,
      foodName,
      restaurantId,
      category,
      img,
      description,
      oldPrice,
      newPrice,
    });

    await foodItem.save();
    res.json({ message: "item added successfully", foodItem });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.json({ message: "Server error in adding food to cart", error });
  }
};
