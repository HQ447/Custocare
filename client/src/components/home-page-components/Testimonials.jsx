import React, { useState, useEffect } from "react";
import { Star, StarHalf, Clock } from "lucide-react";

const TestimonialCard = ({ feedback }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-3 h-3 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }

    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start space-x-3">
        <img
          src={feedback.img}
          alt={feedback.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${feedback.name}&background=f3f4f6&color=374151`;
          }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {feedback.name}
            </h4>
            <div className="flex items-center space-x-1">
              {renderStars(feedback.rating)}
              <span className="text-xs text-gray-600 ml-1">
                {feedback.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-2 line-clamp-3">
            {feedback.feedback}
          </p>

          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(feedback.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const domain = "http://localhost:8000/app";

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token"); // Adjust based on your token storage

      const response = await fetch(`${domain}/getAllFeedbacks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adjust based on your auth implementation
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }

      const data = await response.json();
      setFeedbacks(data.feedbacks || data); // Adjust based on your API response structure
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-2 bg-gray-300 rounded mb-1"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Reviews
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 text-sm">
              Failed to load reviews: {error}
            </div>
            <button
              onClick={fetchFeedbacks}
              className="ml-4 text-red-600 hover:text-red-800 text-sm underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  flex flex-col  px-20">
      <div className=" text-center mb-6 ">
        <h2 className="text-2xl  font-semibold text-gray-900 mb-1">
          What Our Customers Say
        </h2>
        <p className="text-sm text-gray-600">
          Read reviews from our satisfied customers
        </p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">No reviews available yet</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.map((feedback) => (
            <TestimonialCard key={feedback._id} feedback={feedback} />
          ))}
        </div>
      )}

      {feedbacks.length > 0 && (
        <div className="text-center mt-6">
          <div className="text-xs text-gray-500">
            Showing {feedbacks.length} review{feedbacks.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
