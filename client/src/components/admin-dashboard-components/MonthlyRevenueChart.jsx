import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const monthNames = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function MonthlyRevenueChart({ data }) {
  const formattedData = data.map((entry) => ({
    name: `${monthNames[entry._id.month]} ${entry._id.year}`,
    revenue: entry.revenue,
  }));

  return (
    <div className="mt-6 bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `Rs. ${value}`} />
          <Tooltip formatter={(value) => `Rs. ${value}`} />
          <Bar dataKey="revenue" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyRevenueChart;
