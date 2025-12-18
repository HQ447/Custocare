import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/authUtils";
import { FaTruckFast } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineShoppingCart } from "react-icons/hi2";

function Navbar() {
  const navigate = useNavigate();
  //const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        //setUserLocation([latitude, longitude]);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setAddress(data.display_name || "Unknown Location");
        } catch (error) {
          console.error("Failed to reverse geocode:", error);
          setAddress("Location not found");
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setAddress("Location permission denied");
      }
    );
  }, []);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        handleLogout();
        navigate("/");
      }
    };

    const interval = setInterval(checkTokenExpiry, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="fixed top-0 w-full z-10 bg-white px-4 md:px-20 py-3 shadow">
      <div className="flex justify-between ">
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className=" text-xl md:text-2xl font-bold">Custocare</h1>
          <p className="text-[10px] md:text-xs text-gray-700 self-end">Pakistan</p>
        </div>

{!role &&
        <div className="location flex items-center gap-2 w-1/3">
          <FaLocationDot className="text-2xl text-red-500" />

          <p className="text-xs md:text-sm text-gray-600 truncate">
            {address || "Fetching location..."}
          </p>
        </div>
}

        <div className="flex text-sm items-center gap-3">
          <h1>{name ? name : "Guest"}</h1>

          {role && (
            <div>
              {role === "customer" ? (
                <div className="flex justify-center items-center gap-2">
                  <FaTruckFast
                    onClick={() => navigate("order")}
                    className="text-2xl cursor-pointer hover:scale-105 transition-all"
                  />
                  <HiOutlineShoppingCart
                    onClick={() => navigate("fav")}
                    className="text-2xl cursor-pointer hover:scale-105 transition-all"
                  />
                </div>
              ) : role === "owner" ? (
                <button
                  onClick={() => navigate("/owner-dashboard")}
                  className="bg-violet-600 hover:scale-95 transition-all hover:bg-violet-500 px-4 py-2 rounded-md text-white font-semibold"
                >
                  Owner Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="bg-green-400 hover:scale-95 transition-all hover:bg-green-500 px-4 py-2 rounded-md text-white font-semibold"
                >
                  Admin Dashboard
                </button>
              )}
            </div>
          )}

          {!role ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-amber-400 hover:scale-95 transition-all hover:bg-amber-500 px-2 py-1  md:px-4 md:py-2 text-sm rounded-md text-white font-semibold"
            >
              Login
            </button>
          ) : (
            <FiLogOut
              onClick={handleLogout}
              className="text-2xl text-red-600 hover:scale-110 transition-all cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
