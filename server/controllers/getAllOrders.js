import Order from "../models/Order.js";

export const getCustomerOrders = async (req, res) => {
  const id = req.user.id;
  console.log(id);
  try {
    const orders = await Order.find({ customerId: id });

    if (!orders)
      return res.json({ message: "no orders found of that customer" });

    res.json({ message: "orders found", orders });
  } catch (error) {
    res.json({ message: "error in getting orders", error });
    console.log(error);
  }
};
