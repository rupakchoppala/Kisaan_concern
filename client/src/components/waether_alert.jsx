import React, { useState, useEffect } from "react";

const POLL_INTERVAL = 15 * 60 * 1000; // 15 mins

// Weather code mapping (Open-Meteo docs)
const WEATHER_CODES = {
  0: "☀️ Clear sky",
  1: "🌤️ Mainly clear",
  2: "⛅ Partly cloudy",
  3: "☁️ Overcast",
  45: "🌫️ Fog",
  48: "🌫️ Depositing rime fog",
  51: "🌦️ Light drizzle",
  61: "🌧️ Light rain",
  71: "❄️ Snow fall",
  80: "🌧️ Rain showers",
  95: "⛈️ Thunderstorm",
};

const WeatherAlerts = () => {
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  // 1. Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // 2. Fetch weather data
  const fetchWeather = async () => {
    if (!coords) return;
    const { lat, lon } = coords;

    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,apparent_temperature,weathercode,wind_speed_10m` +
          `&hourly=temperature_2m&forecast_days=1&timezone=auto`
      );
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();

      setWeather({
        temp: data.current?.temperature_2m,
        feels: data.current?.apparent_temperature,
        wind: data.current?.wind_speed_10m,
        code: data.current?.weathercode,
      });

      // Next few hours forecast
      setForecast(data.hourly?.temperature_2m?.slice(0, 5) || []);

      // Reverse geocode → location name
      const locRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en`
      );
      const locData = await locRes.json();
      setLocation(locData?.results?.[0]?.name || "Your Location");
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  };

  // 3. Polling
  useEffect(() => {
    if (!coords) return;
    fetchWeather();
    const id = setInterval(fetchWeather, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [coords]);

  // 4. Helper for advice
  const getAdvice = () => {
    if (!weather) return "";
    if (weather.code >= 61 && weather.code < 80) return "🌧️ Carry an umbrella!";
    if (weather.temp > 35) return "🔥 Stay hydrated!";
    if (weather.temp < 15) return "🧥 Wear warm clothes!";
    return "✅ Good weather for farming.";
  };

  return (
    <div className="max-w-sm bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-5 m-4 border border-green-200">
      <h3 className="text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
        🌦️ Local Weather
      </h3>

      {weather ? (
        <div className="space-y-3">
          <p className="text-gray-700 font-medium">📍 {location}</p>
          <p>🌡️ Temp: {weather.temp}°C (feels {weather.feels}°C)</p>
          <p>💨 Wind: {weather.wind} km/h</p>
          <p>{WEATHER_CODES[weather.code] || "ℹ️ Unknown weather"}</p>
          <p className="font-semibold text-green-700">{getAdvice()}</p>

          {/* Mini forecast */}
          <div className="mt-3">
            <h4 className="font-medium text-gray-700 mb-1">Next hours:</h4>
            <div className="flex gap-2">
              {forecast.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                >
                  {t}°C
                </span>
              ))}
            </div>
          </div>
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
