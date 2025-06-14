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
      setForm({
        foodName: "",
        description1: "",
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
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Adding new restaurant */}
      <div className=" mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          ➕ Add New Restaurant
        </h2>

        {/* 🖼️ Image Upload Preview Container */}
        <label
          htmlFor="img"
          className="border border-dashed border-gray-400 p-4 h-32 mb-6 flex items-center justify-center bg-gray-100 cursor-pointer"
          onClick={() => restaurantFile.current.click()}
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
          ref={restaurantFile}
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

      {/* Adding Food */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          ➕ Add New Food
        </h2>

        {/* Image Preview */}
        <label
          htmlFor="img"
          className="border border-dashed border-gray-400 bg-gray-50 h-48 flex justify-center items-center cursor-pointer mb-4"
          onClick={() => foodFile.current.click()}
        >
          {imagePreview1 ? (
            <img
              src={imagePreview1}
              alt="Preview"
              className="h-full object-contain"
            />
          ) : (
            <span className="text-gray-500">📷 Click to upload food image</span>
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

        <form onSubmit={handleSubmitFood} className="space-y-3">
          <select
            name="restaurantId"
            value={form.restaurantId}
            onChange={handleChangeFood}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Restaurant</option>
            {restaurants
              .filter((r) => r.status === "Approved")
              .map((r) => (
                <option key={r._id} value={r._id}>
                  {r.restaurantName}
                </option>
              ))}
          </select>

          <input
            type="text"
            name="foodName"
            placeholder="Food Name"
            value={form.foodName}
            onChange={handleChangeFood}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChangeFood}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Food Category</option>

            <option value="veg">Veg Food</option>
            <option value="non-veg">Non Veg Food</option>
          </select>

          <textarea
            type="text"
            name="description1"
            placeholder="Description"
            value={form1.description1}
            onChange={handleChangeFood}
            className="w-full border px-3 py-2 rounded"
            rows="3"
            required
          />
          <input
            type="number"
            name="oldPrice"
            placeholder="Old Price"
            value={form.oldPrice}
            onChange={handleChangeFood}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="newPrice"
            placeholder="New Price"
            value={form.newPrice}
            onChange={handleChangeFood}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Add Food
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageFoods;
