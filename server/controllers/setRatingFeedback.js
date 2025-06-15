import Feedback from "../models/Feedback.js";
import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";

export const setRatingFeedback = async (req, res) => {
  const { rating, feedback } = req.body;
  const customerId = req.user.id;
  const restaurantId = req.params;

  try {
    const customer = await User.findById(customerId);

    if (!customer) return res.json({ messsage: "No user found" });

    const feedback = new feedback({
      customerId,
      restaurantId,
      rating,
      feedback,
    });
  } catch (error) {
    console.log("Error in setting feedback and rating");
  }
};
