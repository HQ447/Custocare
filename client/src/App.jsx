import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageRestaurants from "./components/owner-dashboard-components/ManageRestaurants";
import ManageFoods from "./components/owner-dashboard-components/ManageFoods";
import ManageOrders from "./components/owner-dashboard-components/ManageOrders";
import Analytics from "./components/admin-dashboard-components/Analytics";
import Restaurants from "./components/admin-dashboard-components/Restaurants";
import ManageUsers from "./components/admin-dashboard-components/ManageUsers";
import Settings from "./components/admin-dashboard-components/Settings";
import OrderManagement from "./components/admin-dashboard-components/OrderManagement";
import UpdateRestaurants from "./components/owner-dashboard-components/UpdateRestaurants";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<Analytics />} />
            <Route path="manageRestaurants" element={<Restaurants />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="orders" element={<OrderManagement />} />

            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/owner-dashboard" element={<OwnerDashboard />}>
            <Route index element={<ManageRestaurants />} />
            <Route path="manageFoods" element={<ManageFoods />} />
            <Route path="manageOrder" element={<ManageOrders />} />
            <Route
              path="update-delete-rest/:id"
              element={<UpdateRestaurants />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
