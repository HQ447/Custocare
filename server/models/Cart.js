import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  foodName: { type: String, required: true },
  img: { type: String },
  description: { type: String, required: true },
  category: { type: String, default: "veg" },
  oldPrice: { type: Number },
  newPrice: { type: Number },
});

export default mongoose.model("Cart", cartSchema);
