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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 backdrop-blur-sm">
          <p className="text-slate-700 font-medium mb-1">{label}</p>
          <p className="text-blue-600 font-bold text-lg">
            Rs. {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Monthly Revenue
            </h3>
            <p className="text-slate-600 text-sm">
              Track your revenue performance over time
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            <span className="text-sm text-slate-500 font-medium">Revenue</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6">
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-xl"></div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                strokeOpacity={0.6}
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                tick={{ fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                tickLine={{ stroke: "#cbd5e1" }}
              />

              <YAxis
                tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                tick={{ fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                tickLine={{ stroke: "#cbd5e1" }}
                width={80}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "rgba(59, 130, 246, 0.1)",
                  stroke: "rgba(59, 130, 246, 0.3)",
                  strokeWidth: 1,
                  radius: [4, 4, 0, 0],
                }}
              />

              <Bar
                dataKey="revenue"
                fill="url(#revenueGradient)"
                radius={[6, 6, 0, 0]}
                stroke="#2563eb"
                strokeWidth={0.5}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
            <p className="text-emerald-700 text-sm font-medium mb-1">
              Total Revenue
            </p>
            <p className="text-emerald-900 text-lg font-bold">
              Rs.{" "}
              {formattedData
                .reduce((sum, item) => sum + item.revenue, 0)
                .toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-700 text-sm font-medium mb-1">
              Average Monthly
            </p>
            <p className="text-blue-900 text-lg font-bold">
              Rs.{" "}
              {Math.round(
                formattedData.reduce((sum, item) => sum + item.revenue, 0) /
                  formattedData.length
              ).toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <p className="text-purple-700 text-sm font-medium mb-1">
              Peak Month
            </p>
            <p className="text-purple-900 text-lg font-bold">
              {formattedData.length > 0 &&
                formattedData.reduce(
                  (max, item) => (item.revenue > max.revenue ? item : max),
                  formattedData[0]
                ).name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyRevenueChart;
