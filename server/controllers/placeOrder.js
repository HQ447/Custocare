import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    const { fullName, phone, address, total, paymentMethod } = req.body;
    const customerId = req.user.id;

    // Validate required fields
    if (!fullName || !phone || !address || !total) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cartItems = await Cart.find({ customerId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cartItems.map((item) => ({
      itemId: item._id,
      foodName: item.foodName,
      img: item.img,
      qty: item.qty,
      price: item.newPrice,
    }));

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

    // Clear the cart after successful order
    await Cart.deleteMany({ customerId });

    res.status(200).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
