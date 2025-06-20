import React, { useEffect, useState } from "react";
import {
  Store,
  MapPin,
  User,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit3,
  Image,
} from "lucide-react";

function Restaurants() {
  const [status, setStatus] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const domain = "http://localhost:8000/app";

  const fetchRestaurants = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(`${domain}/getAllRestaurants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setRestaurants(data.restaurants);
      } else {
        alert("Failed to fetch restaurants: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id) => {
    if (!status) {
      alert("Please select a status first!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${domain}/updateRestaurantStatus/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchRestaurants(); // Refresh list
        setStatus(""); // Reset status selection
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "reject":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "banned":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "reject":
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "banned":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Store className="w-4 h-4" />;
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.restaurantName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      restaurant.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {
      total: restaurants.length,
      approved: restaurants.filter(
        (r) => r.status?.toLowerCase() === "approved"
      ).length,
      pending: restaurants.filter((r) => r.status?.toLowerCase() === "pending")
        .length,
      rejected: restaurants.filter(
        (r) =>
          r.status?.toLowerCase() === "reject" ||
          r.status?.toLowerCase() === "rejected"
      ).length,
      banned: restaurants.filter((r) => r.status?.toLowerCase() === "banned")
        .length,
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 font-medium">
            Loading restaurants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Restaurant Management
                </h2>
                <p className="text-slate-600">
                  Monitor and manage restaurant applications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{restaurants.length} Total Restaurants</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
              <Store className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-emerald-800">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-800">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-800">
                  {stats.rejected}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Banned</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.banned}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by restaurant name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="reject">Rejected</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restaurants List */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Restaurants Found
            </h3>
            <p className="text-slate-600">
              {restaurants.length === 0
                ? "No restaurants have been registered yet."
                : "No restaurants match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRestaurants.map((rest) => (
              <div
                key={rest._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Restaurant Image & Info */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative group">
                        {rest.img ? (
                          <img
                            src={rest.img}
                            alt={rest.restaurantName}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Image className="w-8 h-8 text-slate-400" />
                          </div>
                        )}

                        <div className="absolute -top-2 -right-2">
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                              rest.status
                            )}`}
                          >
                            {getStatusIcon(rest.status)}
                            <span className="capitalize">{rest.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {rest.restaurantName}
                        </h3>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                          <p className="text-slate-600">{rest.address}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <p className="text-sm text-slate-500">
                            Owner ID: {rest.ownerId}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Change Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select Status</option>
                          <option value="Approved">Approved</option>
                          <option value="Reject">Rejected</option>
                          <option value="Banned">Banned</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleStatusChange(rest._id)}
                        disabled={!status}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                      >
                        <Edit3 className="w-4 h-4" />
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurants;
