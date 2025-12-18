import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UpdateFood() {
  const { id } = useParams();
  const domain = `${import.meta.env.VITE_BASE_URL}app`;
  const token = localStorage.getItem("token");

  const [previewImg, setPreviewImg] = useState(null);
  const [formData, setFormData] = useState({
    foodName: "",
    category: "",
    description: "",
    oldPrice: "",
    newPrice: "",
    img: null,
  });

  const fetchFood = async () => {
    try {
      const res = await fetch(`${domain}/getFoodItem/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({
          foodName: data.item.foodName || "",
          description: data.item.description || "",
          category: data.item.category || "",
          oldPrice: data.item.oldPrice || "",
          newPrice: data.item.newPrice || "",
          img: null,
        });
        setPreviewImg(data.item.img);
      } else {
        alert("Failed to fetch food: " + data.message);
      }
    } catch (err) {
      console.error("Error fetching food:", err);
    }
  };

  useEffect(() => {
    fetchFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, img: file });
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedForm = new FormData();
      updatedForm.append("foodName", formData.foodName);
      updatedForm.append("category", formData.category);
      updatedForm.append("description", formData.description);
      updatedForm.append("oldPrice", formData.oldPrice);
      updatedForm.append("newPrice", formData.newPrice);
      if (formData.img) {
        updatedForm.append("img", formData.img);
      }

      const res = await fetch(`${domain}/updateFoodItem/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updatedForm,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Food updated successfully!");
      } else {
        alert("Failed to update food: " + data.message);
      }
    } catch (error) {
      console.error("Error updating food:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Food Item</h2>

      {/* Image Preview */}
      <div
        onClick={() => document.getElementById("imgInput").click()}
        className="w-full h-52 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden mb-6"
      >
        {previewImg ? (
          <img
            src={previewImg}
            alt="food preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Click to upload image</span>
        )}
        <input
          type="file"
          id="imgInput"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Food Name</label>
          <input
            type="text"
            name="foodName"
            value={formData.foodName}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Food Category</option>

          <option value="veg">Veg Food</option>
          <option value="non-veg">Non Veg Food</option>
        </select>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Old Price</label>
          <input
            type="number"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">New Price</label>
          <input
            type="number"
            name="newPrice"
            value={formData.newPrice}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Update Food
        </button>
      </form>
    </div>
  );
}

export default UpdateFood;
