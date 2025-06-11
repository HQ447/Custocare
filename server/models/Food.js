import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    foodName: { type: String, required: true },
    img: { type: String },
    description: { type: String, required: true },
    oldPrice: { type: Number },
    newPrice: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);
