import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/authUtils";
import { FaTruckFast } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");

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
  }, [navigate]);

  return (
    <div className="flex justify-between px-20 py-5 bg-gray-50">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold"> Custocare</h1>
        <p className="text-xs text-gray-700 self-end">Pakistan</p>
      </div>
      <div className="location flex justify-center items-center">
        <FaLocationDot className="text-2xl " />
        <p>Pakistan</p>
      </div>
      <div className="flex justify-center items-center gap-2">
        <h1>{name ? name : "Guest"}</h1>

        {role && (
          <div>
            {role == "customer" ? (
              <div>
                <FaTruckFast
                  onClick={() => navigate("order")}
                  className="text-2xl cursor-pointer hover:scale-105 transition-all"
                />
              </div>
            ) : role == "owner" ? (
              <button
                onClick={() => navigate("/owner-dashboard")}
                className="bg-violet-600 cursor-pointer  hover:scale-95 transition-all hover:bg-violet-500 px-4 py-2 rounded-md text-white font-semibold"
              >
                Owner Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="bg-green-400 cursor-pointer  hover:scale-95 transition-all hover:bg-green-500 px-4 py-2 rounded-md text-white font-semibold"
              >
                Admin dashboard
              </button>
            )}
          </div>
        )}

        {!role ? (
          <button
            onClick={() => navigate("/login")}
            className="bg-amber-400 cursor-pointer  hover:scale-95 transition-all hover:bg-amber-500 px-4 py-2 rounded-md text-white font-semibold"
          >
            Login
          </button>
        ) : (
          <FiLogOut
            onClick={handleLogout}
            className="font-bold text-2xl text-red-600 hover:scale-110 transition-all cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}

export default Navbar;
