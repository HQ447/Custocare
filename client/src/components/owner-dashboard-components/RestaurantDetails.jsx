import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RestaurantDetails() {
  const { id } = useParams();
  const domain = "http://localhost:8000/app";
  const token = localStorage.getItem("token");
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`${domain}/getSingleRes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setRestaurant(data.restaurant);
      } else {
        alert("Failed to fetch restaurant: " + data.message);
      }
    } catch (err) {
      console.error("Error fetching restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${domain}/getFoods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setFoods(data.foods);
      } else {
        alert("Failed to fetch foods : " + data.message);
      }
    } catch (err) {
      console.error("Error fetching foods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">
            Loading delicious content...
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Restaurant Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the restaurant you're looking for.
          </p>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ☆
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#0000006c] bg-opacity-20"></div>
        <img
          src={restaurant.img}
          alt={restaurant.restaurantName}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              🍴 {restaurant.restaurantName}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex text-2xl">
                {renderStars(restaurant.rating)}
              </div>
              <span className="text-lg font-medium bg-black bg-opacity-30 px-3 py-1 rounded-full">
                {restaurant.rating ? restaurant.rating.toFixed(1) : "New"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Owner Controls */}
        {role === "owner" && (
          <div className="mb-8 flex justify-end">
            <div className="flex gap-3 bg-white p-4 rounded-xl shadow-lg">
              <button
                onClick={() =>
                  navigate(`/owner-dashboard/updateRestaurant/${id}`)
                }
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                ✏️ Update Restaurant
              </button>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                🗑️ Delete Restaurant
              </button>
            </div>
          </div>
        )}

        {/* Restaurant Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">📝</span>
              <h3 className="text-lg font-semibold text-gray-800">
                Description
              </h3>
            </div>
            <p className="text-white-600 leading-relaxed">
              {restaurant.description}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">📍</span>
              <h3 className="text-lg font-semibold text-gray-800">Location</h3>
            </div>
            <p className="text-gray-600">{restaurant.address}</p>
            {restaurant.coordinates?.coordinates && (
              <p className="text-sm text-gray-500 mt-2">
                Coordinates: {restaurant.coordinates.coordinates.join(", ")}
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">
                {restaurant.status === "open" ? "🟢" : "🔴"}
              </span>
              <h3 className="text-lg font-semibold text-gray-800">Status</h3>
            </div>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                restaurant.status === "open"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {restaurant.status === "open" ? "Open Now" : "Closed"}
            </span>
          </div>
        </div>

        {/* Menu Section */}
        {foods.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                🍽️ Our Menu
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {foods.map((item) => (
                <div
                  key={item._id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Owner Controls for Food Items */}
                  {role === "owner" && (
                    <div className="flex gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() =>
                          navigate(`/owner-dashboard/updateFood/${item._id}`)
                        }
                        className="px-3 py-1 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                        🗑️ Delete
                      </button>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="relative mb-4">
                      <img
                        className="w-24 h-24 object-cover rounded-full mx-auto shadow-lg ring-4 ring-white"
                        src={item.img}
                        alt={item.foodName}
                      />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.foodName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-center gap-3 mb-4">
                      {item.oldPrice && (
                        <span className="text-gray-500 line-through text-lg">
                          ${item.oldPrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-orange-600">
                        ${item.newPrice}
                      </span>
                    </div>

                    {role === "customer" && (
                      <button className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        🛒 Add to Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {foods.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Menu Coming Soon
            </h3>
            <p className="text-gray-600">
              This restaurant is working on their delicious menu. Check back
              soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetails;
