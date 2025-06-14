import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const NearbyRestaurants = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        fetchNearbyRestaurants(longitude, latitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  const fetchNearbyRestaurants = async (lng, lat) => {
    try {
      const res = await fetch(
        `http://localhost:8000/app/nearby?longitude=${lng}&latitude=${lat}`
      );
      const data = await res.json();
      if (data.success) {
        setRestaurants(data.restaurants);
      }
    } catch (err) {
      console.error("Failed to fetch nearby restaurants:", err);
    }
  };

  function handleClick(id) {
    const token = localStorage.getItem("token");

    if (!token) return navigate("/login");
    navigate(`/RestDetail/${id}`);
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Nearby Restaurants (within 1km)
      </h2>

      {userLocation && (
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: "400px", width: "100%", marginBottom: "2rem" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User marker */}
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Restaurant markers */}
          {restaurants.map((rest) => (
            <Marker
              key={rest._id}
              position={[
                rest.coordinates.coordinates[1],
                rest.coordinates.coordinates[0],
              ]}
              icon={L.divIcon({
                html: `
                    <div style="
                      width: 50px;
                      height: 50px;
                    
                      border-radius: 50%;
                      overflow: hidden;
                      border: 3px solid red;
                      box-shadow: 0 0 4px rgba(0,0,0,0.3);
                      background: white;
                    ">
                      <img
                        src="${rest.img ? rest.img : "/profile.png"}"
                        style="width: 100%; height: 100%; object-fit: cover;"
                      />
                    </div>
                  `,
                className: "", // Remove default icon styles
                iconSize: [40, 40],
                iconAnchor: [20, 20], // Center the icon on point
                popupAnchor: [0, -20],
              })}
            >
              <Popup>
                <strong>{rest.restaurantName}</strong>
                <br />
                {rest.address}
                <br />
                <button
                  onClick={() => handleClick(rest._id)}
                  className=" bg-amber-500 text-sm text-white font-semibold rounded-xs px-3 py-1"
                >
                  View
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* Restaurant cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {restaurants.map((rest) => (
          <div key={rest._id} className="bg-white shadow-lg rounded-lg p-4">
            <img
              src={rest.img || "/placeholder.jpg"}
              alt={rest.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="text-lg font-semibold">{rest.restaurantName}</h3>
            <h3 className="text-lg font-semibold">{rest.description}</h3>
            <p className="text-sm text-gray-600">{rest.address}</p>
            <button
              onClick={() => handleClick(rest._id)}
              className=" bg-amber-500 text-sm text-white font-semibold rounded-xs px-5 py-1"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyRestaurants;
