import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    const { fullName, phone, address, total, paymentMethod } = req.body;
    const customerId = req.user.id;

    // Validate fields
    if (!fullName || !phone || !address || !total) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch all cart items for the customer
    const cartItems = await Cart.find({ customerId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Build order items from cart
    const items = cartItems.map((item) => ({
      itemId: item._id,
      foodName: item.foodName,
      img: item.img,
      qty: item.qty,
      price: item.newPrice,
      restaurantId: item.restaurantId, // ✅ directly from cart
    }));

    // Create new order
    const order = new Order({
      customerId,
      name: fullName,
      phone,
      address,
      items,
      total,
      paymentMethod,
    });

    await order.save();

    // Clear the cart
    await Cart.deleteMany({ customerId });

    res.status(200).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
