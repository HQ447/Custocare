import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const LocationPicker = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates([lng, lat]);
    },
  });
  return null;
};

const SetMapCenter = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([coordinates[1], coordinates[0]], 13);
  }, [coordinates, map]);
  return null;
};

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const domain = "http://localhost:8000/app";

  const [loading, setLoading] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${domain}/getRestaurant`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setRestaurants(data.restaurants || data);
      } else {
        alert(data.message || "Failed to fetch restaurants");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      alert("Error fetching restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">
            Loading restaurants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Restaurant Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your restaurants and add new locations
            </p>
          </div>
        </div>
      </div>

      {/* All Restaurants Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🍽️ Your Restaurants
              </h2>
              <p className="text-gray-600">
                Manage and view all your restaurant locations
              </p>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-full">
              <span className="text-blue-700 font-semibold">
                {restaurants.length} Restaurant
                {restaurants.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      restaurant.img || "https://via.placeholder.com/400x240"
                    }
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {restaurant.restaurantName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">📍</span>
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {restaurant.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🍳</span>
                      <p className="text-gray-700 text-sm">
                        {restaurant.cuisine || "Cuisine not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    {restaurant.status === "Pending" ? (
                      <div className="flex items-center justify-center py-3 px-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-yellow-700 font-medium text-sm">
                            Awaiting Admin Approval
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate(`detail/${restaurant._id}`)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                      >
                        View Details →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {restaurants.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No restaurants yet
              </h3>
              <p className="text-gray-600">
                Add your first restaurant to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRestaurants;
