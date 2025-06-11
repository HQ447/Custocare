import React, { useRef, useState } from "react";

const ManageFoods = () => {
  const [form, setForm] = useState({
    foodName: "",
    description: "",
    oldPrice: "",
    newPrice: "",
    restaurantId: "", // dropdown value
    img: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      const file = files[0];
      setForm({ ...form, img: file });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("foodName", form.foodName);
    formData.append("description", form.description);
    formData.append("oldPrice", form.oldPrice);
    formData.append("newPrice", form.newPrice);
    formData.append("restaurantId", form.restaurantId);
    formData.append("img", form.img);

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
        description: "",
        oldPrice: "",
        newPrice: "",
        restaurantId: "",
        img: null,
      });
      setImagePreview(null);
    } else {
      alert("❌ Error: " + data.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        ➕ Add New Food
      </h2>

      {/* Image Preview */}
      <label
        htmlFor="img"
        className="border border-dashed border-gray-400 bg-gray-50 h-48 flex justify-center items-center cursor-pointer mb-4"
        onClick={() => fileInputRef.current.click()}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="h-full object-contain"
          />
        ) : (
          <span className="text-gray-500">📷 Click to upload food image</span>
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="foodName"
          placeholder="Food Name"
          value={form.foodName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="3"
          required
        />
        <input
          type="number"
          name="oldPrice"
          placeholder="Old Price"
          value={form.oldPrice}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="newPrice"
          placeholder="New Price"
          value={form.newPrice}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="restaurantId"
          value={form.restaurantId}
          onChange={handleChange}
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

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Add Food
        </button>
      </form>
    </div>
  );
};

export default ManageFoods;
