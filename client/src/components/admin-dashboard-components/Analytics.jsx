import React, { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import MonthlyRevenueChart from "./MonthlyRevenueChart";
import OrderStatusPieChart from "./OrderStatusPieChart";
import { exportToCSV } from "../../../utils/exportToCSV";

function Analytics() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const domain = "http://localhost:8000/app"; // or your live backend

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

  if (loading) return <p className="text-center mt-4">Loading analytics...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard – Analytics</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <AnalyticsCard label="Total Users" value={data.totalUsers} />
        <AnalyticsCard label="Customers" value={data.totalCustomers} />
        <AnalyticsCard label="Owners" value={data.totalOwners} />
        <AnalyticsCard label="Restaurants" value={data.totalRestaurants} />
        <AnalyticsCard label="Orders" value={data.totalOrders} />
        <AnalyticsCard label="Delivered Orders" value={data.deliveredOrders} />
        <AnalyticsCard label="Pending Orders" value={data.pendingOrders} />
        <AnalyticsCard
          label="Revenue (Delivered)"
          value={`Rs. ${data.totalRevenue.toLocaleString()}`}
        />
      </div>

      {data.monthlyRevenue?.length > 0 && (
        <>
          <MonthlyRevenueChart data={data.monthlyRevenue} />
          <OrderStatusPieChart data={data} />
          <button
            onClick={() =>
              exportToCSV("monthly-revenue.csv", data.monthlyRevenue)
            }
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export Revenue CSV
          </button>
        </>
      )}
    </div>
  );
}

export default Analytics;
