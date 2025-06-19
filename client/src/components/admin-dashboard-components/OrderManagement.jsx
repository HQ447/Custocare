import React, { useEffect, useState } from "react";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const domain = "http://localhost:8000/app";
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${domain}/getAllOrder`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Management</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th>Customer</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.name}</td>
              <td>{o.phone}</td>
              <td>{o.address}</td>
              <td>
                <ul>
                  {o.items.map((item, i) => (
                    <li key={i}>
                      {item.foodName} x {item.qty} - Rs {item.price}
                    </li>
                  ))}
                </ul>
              </td>
              <td>Rs {o.total}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManagement;
