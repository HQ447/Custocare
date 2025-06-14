import React, { useEffect, useRef, useState } from "react";
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
  const [form, setForm] = useState({
    restaurantName: "",
    description: "",
    address: "",
    img: null,
  });

  const [coordinates, setCoordinates] = useState([73.0479, 33.6844]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

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

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className=" p-6">
      {/* All returents */}
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white p-4 rounded shadow-md"
            >
              <img
                src={restaurant.img || "https://via.placeholder.com/300x200"}
                alt={restaurant.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold">
                {restaurant.restaurantName}
              </h2>
              <p className="text-gray-600 text-xs line-clamp-3">
                {restaurant.description}
              </p>
              <p className="text-gray-600">{restaurant.address}</p>
              <p className="text-sm text-gray-500 mt-1">
                Cuisine: {restaurant.cuisine || "Not specified"}
              </p>
              <div>
                {restaurant.status == "Pending" ? (
                  <h1>Waiting For Admin Approval</h1>
                ) : (
                  <div className="w-full flex justify-around items-center">
                    <button
                      onClick={() => navigate(`detail/${restaurant._id}`)}
                      className="px-3 py-1 border-md hover:95 transition-all bg-blue-500 text-white"
                    >
                      View
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adding new restaurant */}
      <div className="w-[60%] mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          ➕ Add New Restaurant
        </h2>

        {/* 🖼️ Image Upload Preview Container */}
        <label
          htmlFor="img"
          className="border border-dashed border-gray-400 p-4 h-32 mb-6 flex items-center justify-center bg-gray-100 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-gray-600">
              📷 Click here to upload restaurant image
            </span>
          )}
        </label>

        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleChange}
          ref={fileInputRef}
          className="hidden"
          required
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="restaurantName"
            placeholder="Restaurant Name"
            value={form.restaurantName}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded focus:outline-none focus:ring"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded focus:outline-none focus:ring resize-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded focus:outline-none focus:ring"
          />

          <label className="font-semibold">
            📍 Click on the map to select restaurant location:
          </label>

          <div className="h-50 w-full rounded overflow-hidden">
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

          <button
            type="submit"
            className="mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Adding Restautrent..." : "➕ Add Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageRestaurants;
