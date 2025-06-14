import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function UpdateRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const domain = "http://localhost:8000/app";
  const token = localStorage.getItem("token");

  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    restaurantName: "",
    address: "",
    description: "",
    coordinates: [0, 0], // [lng, lat]
    img: null,
  });
  const [previewImg, setPreviewImg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${domain}/getSingleRes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const rest = data.restaurant;
          setRestaurant(rest);
          setFormData({
            restaurantName: rest.restaurantName,
            address: rest.address,
            description: rest.description,
            coordinates: rest.coordinates?.coordinates || [0, 0],
            img: null,
          });
          setPreviewImg(rest.img);
        } else {
          alert("Failed to fetch restaurant: " + data.message);
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }));
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = new FormData();
    updatedData.append("restaurantName", formData.restaurantName);
    updatedData.append("address", formData.address);
    updatedData.append("description", formData.description);
    updatedData.append("coordinates", JSON.stringify(formData.coordinates));
    if (formData.img) {
      updatedData.append("img", formData.img);
    }

    try {
      const res = await fetch(`${domain}/updateRestaurant/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updatedData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Restaurant updated successfully!");
        navigate("/owner-dashboard/");
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (err) {
      console.error("Error updating restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  // Component to handle map click events
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          coordinates: [lng, lat],
        }));
      },
    });
    return (
      <Marker position={[formData.coordinates[1], formData.coordinates[0]]} />
    );
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Restaurant</h2>

      {restaurant ? (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6 w-full"
        >
          {/* Image Preview */}
          <div className="flex  w-full">
            <label
              htmlFor="imgUpload"
              className="cursor-pointer relative group w-full"
            >
              <img
                src={previewImg}
                alt="Restaurant"
                className="w-full h-40 object-cover rounded-md border-2 border-gray-300 shadow-md group-hover:opacity-75 transition"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm">Click to change image</span>
              </div>
            </label>
            <input
              id="imgUpload"
              type="file"
              name="img"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Form Inputs */}
          <div>
            <label className="block text-gray-700 font-medium">
              Restaurant Name
            </label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              required
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Map */}
          <div>
            <label className="block text-gray-700 font-medium">
              Pick Location
            </label>
            <MapContainer
              center={[formData.coordinates[1], formData.coordinates[0]]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-64 w-full rounded-md mt-2"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              />
              <LocationMarker />
            </MapContainer>
            <p className="text-sm mt-2 text-gray-600">
              Selected Coordinates: {formData.coordinates[1]},{" "}
              {formData.coordinates[0]}
            </p>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Restaurant"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-500">Loading restaurant data...</p>
      )}
    </div>
  );
}

export default UpdateRestaurant;
