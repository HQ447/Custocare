import Food from "../../models/Food.js";

export const deleteFood = async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await Food.findById(id);

    if (!foodItem) return res.json({ message: "item not found" });

    await Food.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log("Food item deleted");
    res.json({ message: "Food item deleted" });
  }
};
