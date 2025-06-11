import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UpdateRestaurants() {
  const { id } = useParams();
  const domain = "http://localhost:8000/app";
  const token = localStorage.getItem("token");
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`${domain}/getSingleRes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setRestaurant(data.restaurant);
      } else {
        alert("Failed to fetch restaurant: " + data.message);
      }
    } catch (err) {
      console.error("Error fetching restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${domain}/getFoods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setFoods(data.foods);
      } else {
        alert("Failed to fetch foods : " + data.message);
      }
    } catch (err) {
      console.error("Error fetching foods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-10 text-red-600 text-lg">
        Restaurant not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div>
        <h2 className="text-3xl font-bold mb-6">
          🍴 {restaurant.restaurantName}
        </h2>

        <img
          src={restaurant.img}
          alt={restaurant.restaurantName}
          className="w-full h-64 object-cover rounded-lg shadow mb-6"
        />

        <div className="mb-4">
          <p className="text-lg">
            <strong>Description:</strong> {restaurant.description}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            <strong>Address:</strong> {restaurant.address}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            <strong>Status:</strong> {restaurant.status}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            <strong>Rating:</strong>{" "}
            {restaurant.rating ? restaurant.rating : "Not rated yet"}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            <strong>Owner ID:</strong> {restaurant.ownerId}
          </p>
        </div>

        <div>
          <p className="text-lg">
            <strong>Coordinates:</strong>{" "}
            {restaurant.coordinates?.coordinates?.join(", ")}
          </p>
        </div>
      </div>
      <div>
        {foods.length > 0 && (
          <div className="flex flex-wrap gap-5">
            {foods.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 p-10 flex flex-col gap-3"
              >
                <img className="h-20 w-20" src={item.img} alt={item.name} />
                <h1>{item.foodName}</h1>
                <h1>{item.description}</h1>
                <h1>{item.oldPrice}</h1>
                <h1>{item.newPrice}</h1>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateRestaurants;
