import Order from "../../models/Order.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) return res.json({ message: "orders not found" });

    res.json({ message: "orders fetch successfully", orders });
  } catch (error) {
    console.log("error in getting All orders");
    res.json({ message: "error in getting all orders" });
  }
};
