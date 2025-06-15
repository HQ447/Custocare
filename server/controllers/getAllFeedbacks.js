import Feedback from "../models/Feedback.js";

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    if (!feedbacks) return res.json({ message: "No feedback found" });

    res.json({ message: "Feedbacks fetched successfully", feedbacks });
  } catch (error) {
    res.json({ message: "error in fetching feedbacks", error });
    console.log("Error in fetching feedbacks", error);
  }
};
