import React from "react";
import AdminSidebar from "../components/admin-dashboard-components/AdminSidebar";
import { Outlet } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="flex w-full h-screen">
      <AdminSidebar />

      <div className="w-[78%] max-h-screen overflow-y-auto p-10">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
