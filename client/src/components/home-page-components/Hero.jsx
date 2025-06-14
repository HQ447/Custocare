import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Star,
  Leaf,
} from "lucide-react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Delicious Food Delivered",
      subtitle: "Find the best restaurants near you",
      description:
        "Order from your favorite local restaurants and get fresh, hot meals delivered to your doorstep in minutes.",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      ctaText: "Order Now",
      badge: "Fast Delivery",
      color: "from-orange-500 to-red-600",
    },
    {
      id: 2,
      title: "Fresh Veg Delights",
      subtitle: "100% Pure Vegetarian Options",
      description:
        "Explore our wide range of fresh, healthy vegetarian meals prepared with organic ingredients.",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      ctaText: "Browse Veg Menu",
      badge: "Pure Veg",
      color: "from-green-500 to-emerald-600",
      isVeg: true,
    },
    {
      id: 3,
      title: "Premium Non-Veg Cuisine",
      subtitle: "Authentic flavors, perfectly cooked",
      description:
        "Indulge in our selection of premium non-vegetarian dishes crafted by expert chefs.",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      ctaText: "Explore Menu",
      badge: "Chef's Special",
      color: "from-red-500 to-pink-600",
    },
    {
      id: 4,
      title: "Find Food Near You",
      subtitle: "Discover local favorites",
      description:
        "Get recommendations based on your location and enjoy the best food from restaurants nearby.",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
      ctaText: "Find Nearby",
      badge: "Location Based",
      color: "from-blue-500 to-purple-600",
    },
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-screen overflow-hidden w-full mt-10  ">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`px-10 py-0 absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80`}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-5 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left text-white space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2">
                  <span className="bg-white text-black bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                    {slide.isVeg && <Leaf className="w-4 h-4 text-green-300" />}
                    {slide.badge === "Location Based" && (
                      <MapPin className="w-4 h-4" />
                    )}
                    {slide.badge === "Fast Delivery" && (
                      <Clock className="w-4 h-4" />
                    )}
                    {slide.badge === "Chef's Special" && (
                      <Star className="w-4 h-4" />
                    )}
                    <span>{slide.badge}</span>
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-medium opacity-90">
                  {slide.subtitle}
                </h2>

                {/* Description */}
                <p className="text-lg sm:text-xl opacity-80 max-w-2xl">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                  <button className="bg-white text-gray-900 px-6 py-1 rounded-lg font-semibold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    {slide.ctaText}
                  </button>
                  <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-white hover:text-gray-900 transition-all duration-300">
                    View Menu
                  </button>
                </div>

                {/* Stats */}
                <div className="flex justify-center lg:justify-start space-x-8 pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm opacity-80">Restaurants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">30min</div>
                    <div className="text-sm opacity-80">Avg Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.8★</div>
                    <div className="text-sm opacity-80">Rating</div>
                  </div>
                </div>
              </div>

              {/* Image/Visual Element */}
              <div className="hidden lg:block relative">
                <div className="relative w-96 h-96 mx-auto">
                  <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl transform rotate-6"></div>
                  <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl transform -rotate-3"></div>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                  {slide.isVeg && (
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                      <Leaf className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-5 bg-white bg-opacity-20 backdrop-blur-sm text-white  rounded-full hover:bg-opacity-30 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-5 bg-white bg-opacity-20 backdrop-blur-sm text-white  rounded-full hover:bg-opacity-30 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-5 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
