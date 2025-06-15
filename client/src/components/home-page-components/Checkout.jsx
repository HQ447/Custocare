/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });
  const [loading, setLoading] = useState(false);
  const domain = "http://localhost:8000/app";
  const token = localStorage.getItem("token");

  const fetchCartItems = async () => {
    try {
      const res = await fetch(`${domain}/getCartItems`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setCartItems(data.items);
      }
    } catch (error) {
      console.log("error in fetching cart items", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateGrandTotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + item.newPrice * item.qty;
      }, 0)
      .toFixed(2);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !customerInfo.fullName ||
      !customerInfo.phone ||
      !customerInfo.address
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customerInfo,
        total: calculateGrandTotal(),
      };

      // You can uncomment this when you have the API endpoint ready

      const res = await fetch(`${domain}/placeOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed successfully!");
      } else {
        alert("Failed to place order: " + data.message);
      }
    } catch (error) {
      console.log("error in placing order", error);
      alert("Failed to place order");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Get user ID from token if needed

  return (
    <div className="pt-20 px-4 md:px-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Form */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Confirm Your Order
            </h2>

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={customerInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete delivery address"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={customerInfo.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="cod">Cash on Delivery (COD)</option>
                  <option value="visa">Credit Card</option>
                  <option value="debit">Debit Card</option>
                </select>
              </div>
            </form>
          </div>

          {/* Invoice */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Order Summary
            </h2>

            {/* Customer Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-700">
                Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {customerInfo.fullName || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {customerInfo.phone || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {customerInfo.address || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Payment:</span>{" "}
                  {customerInfo.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : customerInfo.paymentMethod === "visa"
                    ? "Credit Card"
                    : "Debit Card"}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-700">
                Order Items
              </h3>

              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No items in cart
                </p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.img}
                        alt=""
                        className="h-10 w-10 rounded-md mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.foodName || item.title || "Item"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.qty} × ${item.newPrice}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ${item.newPrice * item.qty.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                <span>Grand Total:</span>
                <span>${calculateGrandTotal()}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmOrder}
              disabled={loading || cartItems.length === 0}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                loading || cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:bg-green-800"
              }`}
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>

            {cartItems.length === 0 && (
              <p className="text-center text-red-500 text-sm mt-2">
                Add items to cart before confirming order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
