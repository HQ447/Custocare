import React, { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Fav() {
  const [cartItems, setCartItems] = useState([]);
  const domain = `${import.meta.env.VITE_BASE_URL}app`;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
        console.log("data", data.items);
      }
    } catch (error) {
      console.log("error in add to order", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper functions for cart calculations
  const updateQuantity = async (id) => {
    try {
      const res = await fetch(`${domain}/increment/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.log("Error in incrementing qty", error);
    }
  };
  const decQuantity = async (id) => {
    try {
      const res = await fetch(`${domain}/decrement/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.log("Error in incrementing qty", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`${domain}/removeCartItem/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.log("Error in incrementing qty", error);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const quantity = item.qty || 1;
    return sum + item.newPrice * quantity;
  }, 0);

  const deliveryFee = subtotal > 25 ? 0 : 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500">
              Add some delicious items to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {cartItems.map((item, index) => (
                <div
                  key={item._id}
                  className={`p-6 ${
                    index !== cartItems.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Food Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.img}
                        alt={item.foodName}
                        className="w-20 h-20 object-cover rounded-xl shadow-sm"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.foodName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-orange-600">
                          ${item.newPrice.toFixed(2)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => decQuantity(item._id)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 font-medium text-gray-900">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                {deliveryFee === 0 && (
                  <p className="text-xs text-green-600">
                    🎉 Free delivery on orders over $25!
                  </p>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Delivery Time
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-7">25-35 minutes</p>

                <div className="flex items-center space-x-3 mt-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Deliver to
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-7">
                  Your current location
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate(`/checkout/${token}`)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fav;
