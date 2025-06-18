import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

const ManageFoods = () => {
  const [form1, setForm1] = useState({
    foodName: "",
    description1: "",
    category: "",
    oldPrice: "",
    newPrice: "",
    restaurantId: "", // dropdown value
    img1: null,
  });
  const [form, setForm] = useState({
    restaurantName: "",
    description: "",
    address: "",
    img: null,
  });
  const [imagePreview1, setImagePreview1] = useState(null);

  const domain = "http://localhost:8000/app";

  // fetch restaurant list for dropdown
  const [restaurants, setRestaurants] = useState([]);
  React.useEffect(() => {
    const fetchRestaurants = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${domain}/getRestaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRestaurants(data.restaurants);
    };
    fetchRestaurants();
  }, []);

  const handleChangeFood = (e) => {
    const { name, value, files } = e.target;
    if (name === "img1") {
      const file = files[0];
      setForm1({ ...form1, img1: file });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview1(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm1({ ...form1, [name]: value });
    }
  };

  const handleSubmitFood = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("foodName", form1.foodName);
    formData.append("description", form1.description1);
    formData.append("category", form1.category);
    formData.append("oldPrice", form1.oldPrice);
    formData.append("newPrice", form1.newPrice);
    formData.append("restaurantId", form1.restaurantId);
    formData.append("img", form1.img1);

    const res = await fetch(`${domain}/addFood`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Food item added!");
      setForm1({
        foodName: "",
        description1: "",
        category: "",
        oldPrice: "",
        newPrice: "",
        restaurantId: "",
        img1: null,
      });
      setImagePreview1(null);
    } else {
      alert("❌ Error: " + data.message);
    }
  };

  //adding new rest
  const [coordinates, setCoordinates] = useState([73.0479, 33.6844]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const restaurantFile = useRef();
  const foodFile = useRef();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates([longitude, latitude]);
      },
      (err) => {
        console.warn("Geolocation not allowed. Using default.", err);
      }
    );
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "img") {
      const file = e.target.files[0];
      setForm({ ...form, img: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("restaurantName", form.restaurantName);
    formData.append("description", form.description);
    formData.append("address", form.address);
    formData.append("img", form.img);
    formData.append(
      "coordinates",
      JSON.stringify({
        type: "Point",
        coordinates: coordinates,
      })
    );

    const res = await fetch(`${domain}/addRestaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Restaurant added successfully!");
      setForm({ restaurantName: "", description: "", address: "", img: null });
      setImagePreview(null);
      setLoading(false);
    } else {
      alert("❌ Error: " + data.message);
    }
  };

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
        setRestaurants(data.restaurants || data); // depending on your API response structure
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Food & Restaurant Management
            </h1>
            <p className="text-gray-600 text-lg">
              Add new restaurants and manage your food menu
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add New Restaurant Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                🏪 Add New Restaurant
              </h2>
              <p className="text-blue-100 text-center text-sm">
                Create a new restaurant location
              </p>
            </div>

            <div className="p-8">
              {/* Restaurant Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Restaurant Image
                </label>
                <label
                  htmlFor="img"
                  className="group relative border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-6 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
                  onClick={() => restaurantFile.current.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-32 max-w-full object-contain mx-auto rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          Click to change
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                        <span className="text-xl">📷</span>
                      </div>
                      <p className="text-gray-600 font-medium text-sm">
                        Upload restaurant image
                      </p>
                    </div>
                  )}
                </label>

                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleChange}
                  ref={restaurantFile}
                  className="hidden"
                  required
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    placeholder="Enter restaurant name"
                    value={form.restaurantName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your restaurant..."
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter complete address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📍 Restaurant Location
                  </label>
                  <div className="h-48 w-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
                    <MapContainer
                      center={[coordinates[1], coordinates[0]]}
                      zoom={13}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationPicker setCoordinates={setCoordinates} />
                      <SetMapCenter coordinates={coordinates} />
                      <Marker position={[coordinates[1], coordinates[0]]} />
                    </MapContainer>
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Location:</strong> {coordinates[1].toFixed(4)},{" "}
                      {coordinates[0].toFixed(4)}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Adding Restaurant...</span>
                    </div>
                  ) : (
                    <span>🏪 Add Restaurant</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Add New Food Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                🍽️ Add New Food Item
              </h2>
              <p className="text-orange-100 text-center text-sm">
                Add delicious items to your menu
              </p>
            </div>

            <div className="p-8">
              {/* Food Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Food Image
                </label>
                <label
                  htmlFor="img1"
                  className="group relative border-2 border-dashed border-gray-300 hover:border-orange-400 rounded-2xl p-6 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50"
                  onClick={() => foodFile.current.click()}
                >
                  {imagePreview1 ? (
                    <div className="relative">
                      <img
                        src={imagePreview1}
                        alt="Preview"
                        className="max-h-40 max-w-full object-contain mx-auto rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          Click to change
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                        <span className="text-2xl">🍽️</span>
                      </div>
                      <p className="text-gray-600 font-medium mb-1">
                        Upload food image
                      </p>
                      <p className="text-gray-500 text-xs">
                        Show off your delicious food
                      </p>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  name="img1"
                  accept="image/*"
                  onChange={handleChangeFood}
                  ref={foodFile}
                  className="hidden"
                  required
                />
              </div>

              <form onSubmit={handleSubmitFood} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Restaurant
                  </label>
                  <select
                    name="restaurantId"
                    value={form1.restaurantId}
                    onChange={handleChangeFood}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                    required
                  >
                    <option value="">Choose a restaurant</option>
                    {restaurants
                      .filter((r) => r.status === "Approved")
                      .map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.restaurantName}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Food Name
                  </label>
                  <input
                    type="text"
                    name="foodName"
                    placeholder="Enter food name"
                    value={form1.foodName}
                    onChange={handleChangeFood}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form1.category}
                    onChange={handleChangeFood}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="veg">🥗 Vegetarian</option>
                    <option value="non-veg">🍖 Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description1"
                    placeholder="Describe your delicious food item..."
                    value={form1.description1}
                    onChange={handleChangeFood}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Old Price (Optional)
                    </label>
                    <input
                      type="number"
                      name="oldPrice"
                      placeholder="₹0"
                      value={form1.oldPrice}
                      onChange={handleChangeFood}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Price *
                    </label>
                    <input
                      type="number"
                      name="newPrice"
                      placeholder="₹0"
                      value={form1.newPrice}
                      onChange={handleChangeFood}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {form1.oldPrice &&
                  form1.newPrice &&
                  form1.oldPrice > form1.newPrice && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">💰</span>
                        <span className="text-green-700 font-medium text-sm">
                          Great! You're offering a discount of ₹
                          {form1.oldPrice - form1.newPrice}
                        </span>
                      </div>
                    </div>
                  )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🍽️</span>
                    <span>Add Food Item</span>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            📊 Quick Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-2">🏪</div>
              <div className="text-2xl font-bold text-blue-600">
                {restaurants.filter((r) => r.status === "Approved").length}
              </div>
              <div className="text-gray-600 font-medium">
                Active Restaurants
              </div>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-yellow-600">
                {restaurants.filter((r) => r.status === "Pending").length}
              </div>
              <div className="text-gray-600 font-medium">Pending Approval</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-green-600">
                {restaurants.length}
              </div>
              <div className="text-gray-600 font-medium">Total Restaurants</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFoods;
