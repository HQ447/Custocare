import React, { useEffect, useState } from "react";
import { Leaf, Utensils, ShoppingCart, Star, Rss } from "lucide-react";

function Foods() {
  const domain = "http://localhost:8000/app";
  const token = localStorage.getItem("token");
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState("veg");

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${domain}/getAllFoods`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setFoods(data.foods);
      }
    } catch (error) {
      console.log("Error in fetching foods", error);
    }
  };

  const handleAddToCart = async (food) => {
    try {
      const res = await fetch(`${domain}/addToOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(food),
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
      }
    } catch (error) {
      console.log("error in add to order", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) => food.category === category);

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            Food Categories
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Choose from our delicious vegetarian and non-vegetarian dishes
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex gap-2 sm:gap-3 bg-gray-100 p-1 rounded-full">
            <button
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                category === "veg"
                  ? "bg-green-500 text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
              onClick={() => setCategory("veg")}
            >
              <Leaf className="w-4 h-4" />
              <span>Vegetarian</span>
            </button>
            <button
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                category === "non-veg"
                  ? "bg-red-500 text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
              onClick={() => setCategory("non-veg")}
            >
              <Utensils className="w-4 h-4" />
              <span>Non-Vegetarian</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            {category === "veg" ? "Vegetarian" : "Non-Vegetarian"} Dishes
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredFoods.length} items found
          </span>
        </div>

        {/* Food Grid */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredFoods.map((food) => (
              <div
                key={food._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={food.img}
                    alt={food.foodName}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${
                        food.category === "veg"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {food.category === "veg" ? (
                        <Leaf className="w-3 h-3" />
                      ) : (
                        <Utensils className="w-3 h-3" />
                      )}
                      <span>{food.category === "veg" ? "Veg" : "Non-Veg"}</span>
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center space-x-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>4.2</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {food.foodName}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {food.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {food.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${food.oldPrice}
                        </span>
                      )}
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        ${food.newPrice}
                      </span>
                    </div>
                    {food.oldPrice && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Save ${(food.oldPrice - food.newPrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(food)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              {category === "veg" ? (
                <Leaf className="w-10 h-10 text-gray-400" />
              ) : (
                <Utensils className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              No {category === "veg" ? "Vegetarian" : "Non-Vegetarian"} Food
              Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              We couldn't find any{" "}
              {category === "veg" ? "vegetarian" : "non-vegetarian"} dishes at
              the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Foods;
