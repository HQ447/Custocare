import React, { useEffect, useState } from "react";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const domain = "http://localhost:8000/app"; // Change this to your API base URL
  const token = localStorage.getItem("token");
  const [status, setstatus] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // update key if different

      const res = await fetch(`${domain}/getOwnerOrders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id) => {
    setUpdating(true);
    try {
      const res = await fetch(`${domain}/updateOrderStatus/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setUpdating(false);
        fetchOrders();
      }
    } catch (error) {
      console.log("error in order status updating", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500">
            Orders will appear here once customers start placing them.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Orders
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your restaurant orders
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <span className="text-sm text-gray-500">Total Orders</span>
              <div className="text-2xl font-bold text-orange-600">
                {orders.length}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order #{order._id?.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.phone}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <svg
                        className="w-4 h-4 text-gray-400 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">Address:</span>
                      <span className="text-sm font-medium text-gray-900 flex-1">
                        {order.address}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="text-2xl font-bold text-green-600">
                        Rs. {order.total}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    Order Items ({order.items?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-orange-600">
                              {item.qty}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.foodName}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-700">
                          Rs. {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 justify-end items-center mt-3 ">
                  <select
                    name=""
                    id=""
                    onChange={(e) => setstatus(e.target.value)}
                    className="py-2 px-5 border rounded-sm "
                  >
                    <option>Update Order Status</option>
                    <option value="Not Available">Not Available</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    onClick={() => updateOrderStatus(order._id)}
                    className={` ${
                      !status ? " hidden " : ""
                    } px-4 py-2 bg-yellow-500 text-white rounded-sm font-bold`}
                  >
                    {updating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
