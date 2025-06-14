import Cart from "../models/Cart.js";

export const addToOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      foodName,
      restaurantId,
      category,
      img,
      description,
      oldPrice,
      newPrice,
    } = req.body;

    const existingItem = await Cart.findOne({
      customerId,
      foodName,
      restaurantId,
      category,
      description,
      oldPrice,
      newPrice,
    });

    if (existingItem) return res.json({ message: "item already exist" });

    const foodItem = new Cart({
      customerId,
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
    res.json({ message: "Server error in adding food to cart", error });
  }
};
