import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/authUtils";

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
      <h1 className="text-2xl font-bold">Custocare</h1>
      <div className="flex justify-center items-center gap-2">
        <h1>{name ? name : "Guest"}</h1>

        {role && (
          <div>
            {role == "customer" ? (
              <div>icons</div>
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
          <button
            onClick={handleLogout}
            className="bg-red-600 cursor-pointer hover:bg-red-700 hover:scale-95 transition-all px-4 py-2 rounded-md text-white font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
