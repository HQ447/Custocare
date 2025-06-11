import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../../utils/authUtils.js";

function Sidebar() {
  const navigate = useNavigate();

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
    <div className="w-[22%] max-h-screen overflow-y-auto bg-gray-100 flex flex-col gap-4 p-10">
      <div>Account Header Section</div>
      <br />
      <div className="flex flex-col gap-10">
        <NavLink to={""}>My Restaurants</NavLink>
        <NavLink to={"manageFoods"}>Foods Management</NavLink>

        <NavLink to={"manageOrder"}>Order Management</NavLink>
        <NavLink>Settings</NavLink>
      </div>

      <button
        className="px-3 py-1 rounded-md bg-white r-pointer hover:scale-95 transition-all "
        onClick={() => navigate("/")}
      >
        Home
      </button>
      <button
        className="px-3 py-1 rounded-md cursor-pointer hover:scale-95 transition-all bg-red-600 text-white "
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
