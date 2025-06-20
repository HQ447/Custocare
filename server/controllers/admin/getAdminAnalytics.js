import User from "../../models/User.js";
import Restaurant from "../../models/Restaurant.js";
import Order from "../../models/Order.js";
import mongoose from "mongoose";

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalOwners = await User.countDocuments({ role: "owner" });

    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const pendingOrders = await Order.countDocuments({ status: "Pending" });

    const deliveredOrderDocs = await Order.find({ status: "Delivered" }).select(
      "total"
    );
    const totalRevenue = deliveredOrderDocs.reduce(
      (acc, order) => acc + order.total,
      0
    );

    const monthlyRevenue = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      totalUsers,
      totalCustomers,
      totalOwners,
      totalRestaurants,
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalRevenue,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res
      .status(500)
      .json({ message: "Failed to load analytics", error: error.message });
  }
};
