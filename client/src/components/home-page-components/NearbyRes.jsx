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
  const domain = `${import.meta.env.VITE_BASE_URL}app`;
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
        `${domain}/nearby?longitude=${lng}&latitude=${lat}`
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
    <div className="bg-gray-50 py-8 sm:py-12 px-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Nearby Restaurants
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Discover delicious food within 1km of your location
          </p>
        </div>

        {/* Map Section */}
        {userLocation && (
          <div className="mb-8 sm:mb-12">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
                <h3 className="text-sm sm:text-base font-medium text-gray-800">
                  Map View
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Your location and nearby restaurants
                </p>
              </div>
              <MapContainer
                center={userLocation}
                zoom={12}
                style={{
                  height: "300px",
                  width: "100%",
                  zIndex: 0,
                }}
                className="sm:h-96"
                scrollWheelZoom={false}
                doubleClickZoom={true}
                touchZoom={true}
                dragging={true}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User marker */}
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">
                        You are here
                      </div>
                    </div>
                  </Popup>
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
                          width: 40px;
                          height: 40px;
                          border-radius: 50%;
                          overflow: hidden;
                          border: 2px solid #f97316;
                          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                          background: white;
                        ">
                          <img
                            src="${rest.img ? rest.img : "/profile.png"}"
                            style="width: 100%; height: 100%; object-fit: cover;"
                          />
                        </div>
                      `,
                      className: "",
                      iconSize: [40, 40],
                      iconAnchor: [20, 20],
                      popupAnchor: [0, -20],
                    })}
                  >
                    <Popup>
                      <div className="min-w-0 max-w-xs">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {rest.restaurantName}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {rest.address}
                        </p>
                        <button
                          onClick={() => handleClick(rest._id)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded px-3 py-1.5 transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* Restaurant Cards Section */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Nearest Restaurants
            </h3>
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {restaurants.length} found
            </span>
          </div>

          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {restaurants.map((rest) => (
                <div
                  key={rest._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group cursor-pointer"
                  onClick={() => handleClick(rest._id)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={rest.img || "/placeholder.jpg"}
                      alt={rest.restaurantName}
                      className="w-full h-40 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rest.status === "Approved"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {rest.status}
                      </span>
                    </div>

                    {/* Overlay Info */}
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-1 text-white text-xs">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Click to view</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1 flex-1">
                        {rest.restaurantName}
                      </h4>
                      <div className="flex items-center ml-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">4.5</span>
                      </div>
                    </div>

                    {rest.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {rest.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="line-clamp-1">
                          {rest.address?.split(",")[0] || rest.address}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>15-25 min</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Delivery</span>
                        <span className="text-xs font-medium text-green-600">
                          Free
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick(rest._id);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-md px-3 py-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No restaurants found
              </h3>
              <p className="text-sm text-gray-600">
                We couldn't find any restaurants within 1km of your location.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyRestaurants;
