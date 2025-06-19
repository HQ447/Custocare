import Order from "../../models/Order.js";

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) return res.json({ message: "no order found" });

    order.status = status;
    await order.save();

    res.json({ message: "order status updated" });
  } catch (error) {
    console.log("Server Error in updating status");
    res.json({ message: "Error in updating status", error });
  }
};
