"use client"; // Mark this file as a Client Component

import React, { useState } from "react";
import getWeather from "./api/getWeather";
import Nav from "./Nav"; // Ensure Nav is properly implemented

export default function Home() {
  const [coordinates, setCoordinates] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");

  const handleSearch = async () => {
    const [lat, lon] = coordinates.split(",").map((coord) => coord.trim());

    if (isValidLatLon(lat, lon)) {
      try {
        const data = await getWeather(lat, lon);
        setWeatherData(data);
        setError(""); // Clear any previous errors
      } catch (err) {
        setWeatherData(null); // Clear weather data on error
        setError("Error fetching weather data.");
        console.error(err);
      }
    } else {
      setError("Invalid latitude and longitude format. Please use 'lat, lon'.");
    }
  };

  const isValidLatLon = (lat, lon) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    return (
      !isNaN(latNum) &&
      !isNaN(lonNum) &&
      latNum >= -90 &&
      latNum <= 90 &&
      lonNum >= -180 &&
      lonNum <= 180
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Nav />
      <main className="flex-1 flex justify-center items-center p-6">
        <div className="search-container bg-white p-8 rounded-lg shadow-lg border border-gray-300 w-full max-w-lg">
          <h1 className="text-gray-800 font-bold text-2xl mb-6 text-center">
            Find Weather Data by Latitude and Longitude
          </h1>
          <input
            type="text"
            id="coordinates"
            name="coordinates"
            className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mb-4 text-center"
            placeholder="Enter latitude, longitude (e.g., 15,100)"
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
          />
          <p className="text-blue-500 text-sm mb-6 text-center">
            <a
              href="https://gist.github.com/metal3d/5b925077e66194551df949de64e910f6#file-country-coord-csv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find Coordinates
            </a>
          </p>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <button
            type="button"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSearch}
          >
            Search
          </button>

          {weatherData && (
            <div className="mt-8 p-6 bg-blue-100 text-blue-800 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="text-lg">Temperature: {weatherData.main.temp}°C</p>
              <p className="text-lg">
                Weather: {weatherData.weather[0].description}
              </p>
              <p className="text-lg">Humidity: {weatherData.main.humidity}%</p>
              <p className="text-lg">
                Wind Speed: {weatherData.wind.speed} m/s
              </p>
              <button
                type="button"
                className="mt-4 w-full py-2 px-4 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Add to Favorites
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
