import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../../utils/axiosInstance";
const NearbyFarmers = ({ searchRole = "farmer" }) => {
  const [coords, setCoords] = useState(null);
  const [users, setUsers] = useState([]);

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch nearby users
  useEffect(() => {
    if (!coords) return;
    const fetchNearby = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/users/nearby?lat=${coords.lat}&lon=${coords.lon}&role=${searchRole}`
        );
        setUsers(data);
      } catch (err) {
        console.error("Error fetching nearby:", err);
      }
    };
    fetchNearby();
  }, [coords, searchRole]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-green-800">
        Nearby {searchRole === "farmer" ? "Farmers" : "Consumers"}
      </h2>

      {/* Map */}
      {coords && (
        <MapContainer
          center={[coords.lat, coords.lon]}
          zoom={12}
          style={{ height: "400px", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* Your location */}
          <Marker position={[coords.lat, coords.lon]}>
            <Popup>📍 You are here</Popup>
          </Marker>
          {/* Nearby users */}
          {users.map((u, i) => (
            <Marker key={i} position={[u.location.coordinates[1], u.location.coordinates[0]]}>
              <Popup>
                <div className="text-sm">
                  <strong>{u.userName}</strong>
                  <br />
                  {u.role}
                  <br />
                  <a href={`mailto:${u.email}`} className="text-blue-600 underline">
                    Contact
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* List */}
      <ul className="space-y-2">
        {users.map((u, i) => (
          <li key={i} className="p-3 bg-green-50 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <img
                src={u.photo || "https://via.placeholder.com/40"}
                alt={u.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{u.userName}</p>
                <p className="text-sm text-gray-600">{u.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearbyFarmers;
