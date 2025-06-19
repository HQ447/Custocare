import React, { useEffect } from "react";
import {
  BarChart3,
  Store,
  Users,
  ShoppingBag,
  Settings,
  Home,
  LogOut,
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { isTokenExpired } from "../../../utils/authUtils";

function AdminSidebar() {
  // Mock navigate and NavLink for demonstration
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Mock isTokenExpired function

  function handleLogout() {
    localStorage.clear(); // Commented out for demo
    console.log("Logging out...");
    navigate("/");
  }

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token"); // Commented out for demo

      let expired = false;

      if (token && isTokenExpired(token)) {
        expired = true;
      }

      if (expired) {
        handleLogout();
        navigate("/");
      }
    };

    const interval = setInterval(checkTokenExpiry, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { to: "", icon: BarChart3, label: "Analytics" },
    { to: "manageRestaurants", icon: Store, label: "Restaurants Management" },
    { to: "users", icon: Users, label: "User Management" },
    { to: "orders", icon: ShoppingBag, label: "Orders Management" },
    { to: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Your original sidebar structure with enhanced styling */}
      <div
        className={`
        fixed lg:relative
        w-80 lg:w-[22%] 
        min-w-[280px] lg:min-w-0
        max-h-screen 
        overflow-y-auto 
        bg-gradient-to-b from-gray-50 to-gray-100 
        border-r border-gray-200
        flex flex-col 
        gap-4 
        p-6 lg:p-10
        shadow-xl lg:shadow-none
        z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Header Section - Enhanced */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">FoodAdmin</h2>
            <p className="text-sm text-gray-500">Dashboard Panel</p>
          </div>
        </div>

        <br />

        {/* Navigation Links - Enhanced */}
        <div className="flex flex-col gap-3">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={index}
                to={item.to}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md hover:text-orange-600 transition-all duration-200 border border-transparent hover:border-orange-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0 group-hover:text-orange-600" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Home Button - Enhanced */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:scale-[0.98] transition-all duration-200 shadow-sm"
          onClick={() => {
            navigate("/");
            setIsMobileMenuOpen(false);
          }}
        >
          <Home className="w-4 h-4" />
          Home
        </button>

        {/* Logout Button - Enhanced */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 hover:scale-[0.98] transition-all duration-200 shadow-lg shadow-red-500/25"
          onClick={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );
}

export default AdminSidebar;
