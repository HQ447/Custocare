import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#f59e0b"];

function OrderStatusPieChart({ data }) {
  const chartData = [
    { name: "Delivered", value: data.deliveredOrders },
    { name: "Pending", value: data.pendingOrders },
  ];

  return (
    <div className="mt-6 bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Order Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} orders`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrderStatusPieChart;
