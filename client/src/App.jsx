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
import RestaurantDetails from "./components/owner-dashboard-components/RestaurantDetails";
import UpdateRestaurant from "./components/owner-dashboard-components/UpdateRestaurant";
import UpdateFood from "./components/owner-dashboard-components/UpdateFood";
import Header from "./components/home-page-components/Header";
import NearbyRestaurants from "./components/home-page-components/NearbyRes";
import Services from "./components/home-page-components/Services";
import RestaurantDetail from "./components/home-page-components/RestaurantDetail";
import Checkout from "./components/home-page-components/Checkout";
import Order from "./components/home-page-components/Order";
import Fav from "./components/home-page-components/Fav";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Header />} />
            <Route path="Nearby" element={<NearbyRestaurants />} />
            <Route path="services" element={<Services />} />
            <Route path="RestDetail/:id" element={<RestaurantDetails />} />
            <Route path="checkout/:id" element={<Checkout />} />
            <Route path="order" element={<Order />} />
            <Route path="fav" element={<Fav />} />
          </Route>
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
            <Route path="detail/:id" element={<RestaurantDetails />} />
            <Route path="updateRestaurant/:id" element={<UpdateRestaurant />} />
            <Route path="updateFood/:id" element={<UpdateFood />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
