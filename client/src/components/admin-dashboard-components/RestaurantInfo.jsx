import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RestaurantInfo() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const token = localStorage.getItem("token");
   

   const domain = `${import.meta.env.VITE_BASE_URL}app`;
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${domain}/getSingleRes/${id}` , { headers: {
          Authorization: `Bearer ${token}`,
        },});
        const data = await res.json();
console.log(data)
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch restaurant");
        }

        setRestaurant(data.restaurant);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, domain]);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Image */}
      <div className="w-full h-[350px] rounded-2xl overflow-hidden shadow-lg">
        <img
          src={restaurant.img}
          alt={restaurant.restaurantName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800">
            {restaurant.restaurantName}
          </h1>

          <p className="mt-3 text-gray-600 leading-relaxed">
            {restaurant.description}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ⭐ {restaurant.rating.toFixed(1)} ({restaurant.ratingCount} reviews)
            </span>

            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {restaurant.status}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-semibold text-gray-800">
            Restaurant Info
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Address:</span>{" "}
              {restaurant.address}
            </p>

            <p>
              <span className="font-medium text-gray-800">Owner ID:</span>{" "}
              {restaurant.ownerId}
            </p>

            <p>
              <span className="font-medium text-gray-800">Created At:</span>{" "}
              {new Date(restaurant.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantInfo;
