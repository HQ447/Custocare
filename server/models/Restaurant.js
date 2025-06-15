import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantName: { type: String, required: true },
    img: { type: String },
    description: { type: String, required: true },
    address: { type: String, required: true },
    ratingCount: { type: Number },
    status: { type: String, default: "Pending" },
    rating: { type: Number, default: 1 },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ coordinates: "2dsphere" });
export default mongoose.model("Restaurant", restaurantSchema);
