import React, { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import MonthlyRevenueChart from "./MonthlyRevenueChart";
import OrderStatusPieChart from "./OrderStatusPieChart";
import { exportToCSV } from "../../../utils/exportToCSV";
import {
  Download,
  TrendingUp,
  Users,
  Store,
  ShoppingBag,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";

function Analytics() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const domain = `${import.meta.env.VITE_BASE_URL}app`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${domain}/admin/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          console.error("Failed to fetch analytics", result.message);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 font-medium">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  const cardData = [
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Customers",
      value: data.totalCustomers,
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Owners",
      value: data.totalOwners,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Restaurants",
      value: data.totalRestaurants,
      icon: Store,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Orders",
      value: data.totalOrders,
      icon: ShoppingBag,
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Delivered Orders",
      value: data.deliveredOrders,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Pending Orders",
      value: data.pendingOrders,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Revenue (Delivered)",
      value: `Rs. ${data.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                Admin Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Monitor your business performance and key metrics
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {card.value || 0}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium">{card.label}</p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${card.color}`}></div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        {data.monthlyRevenue?.length > 0 && (
          <div className="space-y-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Monthly Revenue Trends
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Track your revenue performance over time
                </p>
              </div>
              <div className="p-6">
                <MonthlyRevenueChart data={data.monthlyRevenue} />
              </div>
            </div>

            {/* Order Status Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  Order Status Distribution
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Analyze order completion rates
                </p>
              </div>
              <div className="p-6">
                <OrderStatusPieChart data={data} />
              </div>
            </div>

            {/* Export Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Export Data
                  </h3>
                  <p className="text-slate-600">
                    Download your monthly revenue data for further analysis
                  </p>
                </div>
                <button
                  onClick={() =>
                    exportToCSV("monthly-revenue.csv", data.monthlyRevenue)
                  }
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <Download className="w-5 h-5" />
                  Export Revenue CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {(!data.monthlyRevenue || data.monthlyRevenue.length === 0) && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Chart Data Available
            </h3>
            <p className="text-slate-600">
              Monthly revenue data will appear here once available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
