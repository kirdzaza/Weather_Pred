"use client"; // Ensure this line is at the top of the file

import React, { useEffect, useState } from "react";
import { getForecastData } from "../api/forecast"; // Ensure correct API import
import Nav from "../Nav"; // Ensure correct import path

export default function Forecast() {
  const [forecasts, setForecasts] = useState([]); // Store multiple forecasts
  const [showAllDetails, setShowAllDetails] = useState({}); // Store details toggle state for each forecast

  useEffect(() => {
    // Initial fetch with default coordinates
    fetchForecastData(15, 100); // Use appropriate coordinates for the default location (e.g., Thailand)
  }, []);

  const fetchForecastData = (lat, lon) => {
    getForecastData(lat, lon).then((newData) => {
      setForecasts((prev) => [...prev, newData]); // Add new forecast to the list
    });
  };

  const handleAddMoreCoordinates = () => {
    const lat = parseFloat(prompt("Enter latitude:"));
    const lon = parseFloat(prompt("Enter longitude:"));

    if (!isNaN(lat) && !isNaN(lon)) {
      fetchForecastData(lat, lon); // Fetch data without replacing existing forecasts
    }
  };

  const handleToggleDetails = (index) => {
    setShowAllDetails((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle details visibility for a specific forecast
    }));
  };

  if (!forecasts.length)
    return (
      <div className="text-center text-xl font-semibold mt-10">Loading...</div>
    );

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
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
          {forecasts.map((forecastData, index) => {
            const currentForecast = forecastData.list[0]; // Show only the first entry as current weather
            const date = new Date(currentForecast.dt * 1000); // Convert timestamp to Date
            const temperature = (currentForecast.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
            const precipitation = currentForecast.rain
              ? currentForecast.rain["1h"]
              : 0;
            const wind = currentForecast.wind.speed;
            const humidity = currentForecast.main.humidity;
            const pressure = currentForecast.main.pressure;
            const weatherIcon = `http://openweathermap.org/img/wn/${currentForecast.weather[0].icon}.png`;

            return (
              <div
                key={index}
                className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
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
                  onClick={() => handleToggleDetails(index)}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  {showAllDetails[index] ? "Show Less" : "More Details"}
                </button>
                {showAllDetails[index] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {forecastData.list.map((entry, i) => {
                      if (i === 0) return null; // Skip the current weather card already displayed

                      const entryDate = new Date(entry.dt * 1000);
                      const entryTemperature = (
                        entry.main.temp - 273.15
                      ).toFixed(1);
                      const entryPrecipitation = entry.rain
                        ? entry.rain["1h"]
                        : 0;
                      const entryWind = entry.wind.speed;
                      const entryHumidity = entry.main.humidity;
                      const entryPressure = entry.main.pressure;
                      const entryIcon = `http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;

                      return (
                        <div
                          key={i}
                          className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg"
                        >
                          <div className="flex items-center mb-4">
                            <img
                              src={entryIcon}
                              alt={entry.weather[0].description}
                              className="w-12 h-12 mr-4"
                            />
                            <div className="text-xl font-semibold text-gray-700">
                              {forecastData.city.name}
                            </div>
                          </div>
                          <p className="text-gray-600">
                            <strong>Date/Time:</strong>{" "}
                            {entryDate.toLocaleDateString()}{" "}
                            {entryDate.toLocaleTimeString()}
                          </p>
                          <p className="text-gray-600">
                            <strong>Temperature:</strong> {entryTemperature}°C
                          </p>
                          <p className="text-gray-600">
                            <strong>Precipitation:</strong> {entryPrecipitation}{" "}
                            mm
                          </p>
                          <p className="text-gray-600">
                            <strong>Wind:</strong> {entryWind} m/s
                          </p>
                          <p className="text-gray-600">
                            <strong>Humidity:</strong> {entryHumidity}%
                          </p>
                          <p className="text-gray-600">
                            <strong>Pressure:</strong> {entryPressure} hPa
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
