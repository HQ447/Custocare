import Cart from "../models/Cart.js";

export const getCartItems = async (req, res) => {
  const id = req.user.id;
  try {
    const items = await Cart.find({ customerId: id });

    if (!items) return res.json({ message: "no item found of that customer" });

    res.json({ message: "Cart items found", items });
  } catch (error) {
    res.json({ message: "error in getting cart items", error });
    console.log(error);
  }
};
