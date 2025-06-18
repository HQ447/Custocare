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
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food", // or whatever your food model is called
    required: true,
  },
  foodName: { type: String, required: true },
  img: { type: String },
  description: { type: String, required: true },
  qty: { type: Number, default: 1 },
  category: { type: String, default: "veg" },
  oldPrice: { type: Number },
  newPrice: { type: Number },
});

export default mongoose.model("Cart", cartSchema);
