// getWeatherP/page.js
"use client"; // Add this line at the top of the file

import React, { useEffect, useState } from "react";
import getWeather from "../api/getWeather"; // Ensure API call is correctly imported
import Nav from "../Nav";

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch weather data on component mount
    const fetchData = async () => {
      try {
        const data = await getWeather(15, 100); // Example coordinates
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching weather data.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Nav />
      <main className="flex-1 flex justify-center items-center p-6">
        <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-300 w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4">Current Weather</h1>
          {loading && <p className="text-blue-600">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {weatherData && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-2">{weatherData.name}</h2>
              <p className="text-lg">Temperature: {weatherData.main.temp}°C</p>
              <p className="text-lg">
                Weather: {weatherData.weather[0].description}
              </p>
              <p className="text-lg">Humidity: {weatherData.main.humidity}%</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
