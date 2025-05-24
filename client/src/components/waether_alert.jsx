import React, { useState, useEffect } from "react";

const OPEN_WEATHER_KEY = "be9fde932b48470d482d33e75925a431";
const POLL_INTERVAL = 15 * 60 * 1000;

const WeatherAlerts = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // 1. Prompt for location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // 2. Fetch weather using correct URL template
  const fetchWeather = async () => {
    if (!coords) return;
    const { lat, lon } = coords;
  
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall`
        + `?lat=${lat}`
        + `&lon=${lon}`
        + `&exclude=minutely,hourly,daily`
        + `&units=metric`
        + `&appid=${OPEN_WEATHER_KEY}`
      );
      if (!res.ok) throw new Error(`Weather API error ${res.status}`);
      const data = await res.json();
      setWeather(data.current);
      const newAlerts = data.alerts || [];
  
      newAlerts.forEach((alert) => {
        const seen = alerts.some(
          (a) => a.event === alert.event && a.start === alert.start
        );
        if (!seen && Notification.permission === "granted") {
          new Notification(`⚠️ ${alert.event}`, {
            body: alert.description,
          });
        }
      });
      setAlerts(newAlerts);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }
  };
  

  // 4. Initial fetch + polling
  useEffect(() => {
    if (!coords) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    fetchWeather();
    const id = setInterval(fetchWeather, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [coords]);

  return (
    <div className="max-w-sm bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 m-4 border border-green-200">
      <h3 className="text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
        🌦️ Local Weather
      </h3>
      {weather ? (
        <div className="space-y-2">
          {/* ... display weather & alerts ... */}
        </div>
      ) : (
        <p className="text-gray-500">
          {coords ? "Fetching weather..." : "Awaiting location access…"}
        </p>
      )}
    </div>
  );
};

export default WeatherAlerts;
