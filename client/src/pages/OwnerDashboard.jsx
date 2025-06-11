import React from "react";
import Sidebar from "../components/owner-dashboard-components/Sidebar";
import { Outlet } from "react-router-dom";

function OwnerDashboard() {
  return (
    <div className="flex w-full h-screen">
      <Sidebar />

      <div className="w-[78%] max-h-screen overflow-y-auto p-10">
        <Outlet />
      </div>
    </div>
  );
}

export default OwnerDashboard;
