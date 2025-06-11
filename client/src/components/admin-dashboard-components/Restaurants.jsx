import React, { useEffect, useState } from "react";

function Restaurants() {
  const [status, setStatus] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const domain = "http://localhost:8000/app";

  const fetchRestaurants = async () => {
    const token = localStorage.getItem("token");

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
    }
  };

  const handleStatusChange = async (id) => {
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
      if (data.ok) {
        //alert("Status updated successfully!");
        fetchRestaurants(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🍽️ All Restaurants</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <div className="space-y-4">
          {restaurants.map((rest) => (
            <div
              key={rest._id}
              className="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={rest.img}
                  alt={rest.restaurantName}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <p>Current Status : {rest.status} </p>
                  <h3 className="text-xl font-semibold">
                    {rest.restaurantName}
                  </h3>
                  <p className="text-gray-600">{rest.address}</p>
                  <p className="text-sm text-gray-500">
                    Owner ID: {rest.ownerId}
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <label className="text-sm text-gray-700 mr-2">Status:</label>
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option>Select Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Reject">Rejected</option>
                  <option value="Banned">Banned</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <button
                onClick={() => handleStatusChange(rest._id)}
                className="px-3 py-1 rounded-sm bg-blue-600 text-white"
              >
                Update
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Restaurants;
