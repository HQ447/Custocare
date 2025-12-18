import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RestaurantDetails() {
  const { id } = useParams();
  const domain = `${import.meta.env.VITE_BASE_URL}app`;
  const token = localStorage.getItem("token");
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Feedback state
  const [currentRating, setCurrentRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Star Rating Component
  const StarRating = ({
    rating,
    onRatingChange,
    size = 24,
    editable = true,
  }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (starIndex) => {
      if (editable && onRatingChange) {
        onRatingChange(starIndex);
      }
    };

    const handleMouseEnter = (starIndex) => {
      if (editable) {
        setHoverRating(starIndex);
      }
    };

    const handleMouseLeave = () => {
      if (editable) {
        setHoverRating(0);
      }
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            type="button"
            className={`transition-colors duration-200 ${
              editable ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            disabled={!editable}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={
                starIndex <= (hoverRating || rating) ? "#ffd700" : "#e4e5e9"
              }
              stroke={
                starIndex <= (hoverRating || rating) ? "#ffd700" : "#e4e5e9"
              }
              strokeWidth="1"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

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

  const handleRatingChange = (newRating) => {
    setCurrentRating(newRating);
  };

  // Submit feedback and rating
  const handleSubmitFeedback = async () => {
    // Check if both rating and feedback are provided
    if (!currentRating || currentRating < 1 || currentRating > 5) {
      alert("Please provide a rating between 1 and 5 stars");
      return;
    }

    if (!feedbackText.trim()) {
      alert("Please enter your feedback");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${domain}/ratingFeedback/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: currentRating,
          feedback: feedbackText.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Reset form
        setCurrentRating(0);
        setFeedbackText("");
        // Refresh restaurant data to show updated rating
        fetchRestaurant();
        fetchFeedbacks();
      } else {
        alert(data.error || data.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${domain}/getFeedbacks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.log("error in fetching feedbacks", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchRestaurant();
    fetchFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
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
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
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

  async function handleAdd(food) {
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
  }

  const handleDeleteFood = async (id) => {
    try {
      const res = await fetch(`${domain}/deleteFoodItem/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchFoods();
      }
    } catch (error) {
      console.log("error in deleting food", error);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const res = await fetch(`${domain}/deleteRestaurant/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        navigate("/owner-dashboard");
      }
    } catch (error) {
      console.log("error in deleting restaurant", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#0000006c] bg-opacity-20"></div>
        <img
          src={restaurant.img}
          alt={restaurant.restaurantName}
          className="w-full h-72 sm:h-80 md:h-96 object-cover"
        />
        <div className="absolute top-10 inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
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
                className="md:px-6 px-4 py-2 md:py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                ✏️ Update 
              </button>
              <button
                onClick={() => handleDeleteRestaurant(restaurant._id)}
                className="md:px-6 px-4 py-2 md:py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                🗑️ Delete 
              </button>
            </div>
          </div>
        )}

        {/* Restaurant Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">📝</span>
              <h3 className="sm:text-lg font-semibold text-gray-800">
                Description
              </h3>
            </div>
            <p className="text-sm text-white-600 leading-relaxed">
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
                {restaurant.status === "Approved" ? "🟢" : "🔴"}
              </span>
              <h3 className="text-lg font-semibold text-gray-800">Status</h3>
            </div>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                restaurant.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {restaurant.status === "Approved" ? "Open Now" : "Closed"}
            </span>
          </div>
        </div>

        {/* Menu Section */}
        {foods.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
                🍽️ Our Menu
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {foods.map((item) => (
                <div
                  key={item._id}
                  className=" relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl  shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Owner Controls for Food Items */}
                  {role === "owner" && (
                    <div className="absolute top-2 z-10  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() =>
                          navigate(`/owner-dashboard/updateFood/${item._id}`)
                        }
                        className="px-3 py-1 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFood(item._id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}

                  <div className="s p-2">
                    <div className="relative mb-4">
                      <img
                        className=" object-cover w-full rounded-md mx-auto shadow-lg ring-white"
                        src={item.img}
                        alt={item.foodName}
                      />
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                      {item.foodName}
                    </h3>
                    <p className="text-gray-600 text-justify line-clamp-3 text-sm mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex   gap-3 mb-4">
                      {item.oldPrice && (
                        <span className="text-gray-500 line-through text-sm md:text-lg">
                          ${item.oldPrice}
                        </span>
                      )}
                      <span className="text-xl md:text-2xl font-bold text-orange-600">
                        ${item.newPrice}
                      </span>
                    </div>

                    {role === "customer" && (
                      <button
                        onClick={() => handleAdd(item)}
                        className="w-full py-2 md:py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        🛒 Add
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
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Menu Coming Soon
            </h3>
            <p className="text-gray-600">
              This restaurant is working on their delicious menu. Check back
              soon!
            </p>
          </div>
        )}

        {/* Feedback Section - Only show for customers */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 mt-10">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
              💬 Feedback
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto rounded-full"></div>
          </div>
          {role === "customer" && (
            <div className="space-y-4">
              {/* Rating Stars */}
              <div className="flex flex-col items-center gap-2">
                <label className="text-sm md:text-lg font-semibold text-gray-700">
                  Rate your experience:
                </label>
                <StarRating
                  rating={currentRating}
                  onRatingChange={handleRatingChange}
                  size={30}
                  editable={true}
                />
                {currentRating > 0 && (
                  <span className="text-sm text-gray-600">
                    {currentRating} out of 5 stars
                  </span>
                )}
              </div>

              {/* Feedback Input */}
              <div className="flex w-full gap-3">
                <input
                  type="text"
                  placeholder="Enter Your Feedback Here"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                  className="py-1 placeholder:text-sm md:py-3 w-full outline-none bg-gray-100 rounded-full px-5 md:px-10"
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={
                    isSubmitting || !currentRating || !feedbackText.trim()
                  }
                  className={`py-1 text-sm md:py-3 px-6 text-white rounded-full transition-all duration-200 ${
                    isSubmitting || !currentRating || !feedbackText.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700 hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}
          <div>
            {feedbacks.length > 0 ? (
              <div className="mt-4 flex flex-col gap-4">
                {feedbacks.map((feedback) => (
                  <div key={feedback._id} className="flex p-5 flex-col gap-2 shadow">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 md:gap-4 items-center ">
                        <img
                          src={feedback.img}
                          alt=""
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                        />
                        <h1 className="font-semibold">{feedback.name}</h1>
                      </div>
                      <p className="text-sm">{new Date(feedback.createdAt).toLocaleString()}</p>
                    </div>

                    <h1 className="text-sm md:text-lg">{feedback.feedback}</h1>
               
                  </div>
                ))}
              </div>
            ) : (
              <p>No comments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
