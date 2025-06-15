import Feedback from "../models/Feedback.js";
import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";

export const setRatingFeedback = async (req, res) => {
  const { rating, feedback } = req.body;
  const customerId = req.user.id;
  const { id: restaurantId } = req.params; // Fixed: extract id from params

  try {
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid rating (1-5 required)" });
    }

    // Check if feedback is provided (since you want both rating and feedback)
    if (!feedback || feedback.trim() === "") {
      return res.status(400).json({ error: "Feedback is required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    const customer = await User.findById(customerId);

    if (!restaurant)
      return res.status(404).json({ message: "No restaurant found" });
    if (!customer) return res.status(404).json({ message: "No user found" }); // Fixed typo

    // Handle cases where restaurant has no previous ratings
    const currentRating = restaurant.rating || 0;
    const currentRatingCount = restaurant.ratingCount || 0;

    const newRatingCount = currentRatingCount + 1;
    const newAverage =
      (currentRating * currentRatingCount + rating) / newRatingCount;

    restaurant.rating = newAverage;
    restaurant.ratingCount = newRatingCount;

    await restaurant.save();

    const newFeedback = new Feedback({
      // Fixed: should be Feedback not feedback
      customerId,
      restaurantId,
      rating,
      feedback,
      name: customer.name,
      img:
        customer.img ||
        "https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg",
    });

    await newFeedback.save();

    res.json({ message: "Thanks for Rating and Feedback" });
  } catch (error) {
    console.log("Error in setting feedback and rating", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
