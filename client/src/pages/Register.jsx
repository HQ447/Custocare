import React, { useState } from "react";
import { User, Mail, Lock, ChefHat, Utensils, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const domain = "http://localhost:8000/app";
  const navigate = useNavigate(); // Uncomment when using in your app
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${domain}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        navigate("/login"); // Uncomment when using in your app
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-bounce delay-75"></div>
        <div className="absolute bottom-40 left-16 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-bounce delay-150"></div>
        <div className="absolute bottom-16 right-8 w-28 h-28 bg-pink-200 rounded-full opacity-20 animate-bounce delay-300"></div>
        <div className="absolute top-1/2 left-4 w-12 h-12 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4 shadow-lg">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            FoodieExpress
          </h1>
          <p className="text-gray-600 text-sm">
            Join thousands of food lovers!
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 text-sm">
              Sign up and get your first meal delivered
            </p>
          </div>

          {/* Welcome Offer Banner */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3 mb-6 border border-green-200">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Welcome Offer!
                </p>
                <p className="text-xs text-green-700">
                  Get 20% off on your first order
                </p>
              </div>
            </div>
          </div>

          <div onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Choose a username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Utensils className="w-5 h-5" />
              <span>Join FoodieExpress</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-3">
              Why join FoodieExpress?
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  Free delivery on first order
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Exclusive member deals</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Priority support</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-gray-600">Loyalty rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom promotional text */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            🎉 Join 50K+ happy customers • 🍔 1000+ restaurants • 🚚 Lightning
            fast delivery
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
