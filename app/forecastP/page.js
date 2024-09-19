"use client"; // Ensure this line is at the top of the file

import React, { useEffect, useState } from "react";
import { getForecastData } from "../api/forecast"; // Ensure correct API import
import Nav from "../Nav"; // Ensure correct import path

export default function Forecast() {
  const [forecastData, setForecastData] = useState(null);
  const [additionalCoordinates, setAdditionalCoordinates] = useState([]);
  const [showAllDetails, setShowAllDetails] = useState(false);

  useEffect(() => {
    // Initial fetch with default coordinates
    fetchForecastData(15, 100); // Use appropriate coordinates
  }, []);

  const fetchForecastData = (lat, lon) => {
    getForecastData(lat, lon).then(setForecastData);
  };

  const handleAddMoreCoordinates = () => {
    const lat = parseFloat(prompt("Enter latitude:"));
    const lon = parseFloat(prompt("Enter longitude:"));

    if (!isNaN(lat) && !isNaN(lon)) {
      setAdditionalCoordinates([...additionalCoordinates, { lat, lon }]);
      fetchForecastData(lat, lon);
    }
  };

  const handleToggleDetails = () => {
    setShowAllDetails(!showAllDetails);
  };

  if (!forecastData)
    return (
      <div className="text-center text-xl font-semibold mt-10">Loading...</div>
    );

  const currentForecast = forecastData.list[0]; // Show only the first entry as current weather
  const date = new Date(currentForecast.dt * 1000); // Convert timestamp to Date
  const temperature = (currentForecast.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
  const precipitation = currentForecast.rain ? currentForecast.rain["1h"] : 0;
  const wind = currentForecast.wind.speed;
  const humidity = currentForecast.main.humidity;
  const pressure = currentForecast.main.pressure;
  const weatherIcon = `http://openweathermap.org/img/wn/${currentForecast.weather[0].icon}.png`;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Weather Forecast
        </h1>
        <button
          onClick={handleAddMoreCoordinates}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-600 transition-colors"
        >
          Add More Coordinates
        </button>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <img
                src={weatherIcon}
                alt={currentForecast.weather[0].description}
                className="w-12 h-12 mr-4"
              />
              <div className="text-xl font-semibold text-gray-700">
                {forecastData.city.name}
              </div>
            </div>
            <p className="text-gray-600">
              <strong>Date/Time:</strong> {date.toLocaleDateString()}{" "}
              {date.toLocaleTimeString()}
            </p>
            <p className="text-gray-600">
              <strong>Temperature:</strong> {temperature}°C
            </p>
            <p className="text-gray-600">
              <strong>Precipitation:</strong> {precipitation} mm
            </p>
            <p className="text-gray-600">
              <strong>Wind:</strong> {wind} m/s
            </p>
            <p className="text-gray-600">
              <strong>Humidity:</strong> {humidity}%
            </p>
            <p className="text-gray-600">
              <strong>Pressure:</strong> {pressure} hPa
            </p>
            <button
              onClick={handleToggleDetails}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              {showAllDetails ? "Show Less" : "More Details"}
            </button>
          </div>
          {showAllDetails && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {forecastData.list.map((entry, index) => {
                if (index === 0) return null; // Skip the current weather card already displayed

                const date = new Date(entry.dt * 1000); // Convert timestamp to Date
                const temperature = (entry.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
                const precipitation = entry.rain ? entry.rain["1h"] : 0;
                const wind = entry.wind.speed;
                const humidity = entry.main.humidity;
                const pressure = entry.main.pressure;
                const weatherIcon = `http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;

                return (
                  <div
                    key={index}
                    className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={weatherIcon}
                        alt={entry.weather[0].description}
                        className="w-12 h-12 mr-4"
                      />
                      <div className="text-xl font-semibold text-gray-700">
                        {forecastData.city.name}
                      </div>
                    </div>
                    <p className="text-gray-600">
                      <strong>Date/Time:</strong> {date.toLocaleDateString()}{" "}
                      {date.toLocaleTimeString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Temperature:</strong> {temperature}°C
                    </p>
                    <p className="text-gray-600">
                      <strong>Precipitation:</strong> {precipitation} mm
                    </p>
                    <p className="text-gray-600">
                      <strong>Wind:</strong> {wind} m/s
                    </p>
                    <p className="text-gray-600">
                      <strong>Humidity:</strong> {humidity}%
                    </p>
                    <p className="text-gray-600">
                      <strong>Pressure:</strong> {pressure} hPa
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
