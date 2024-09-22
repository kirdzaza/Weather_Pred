"use client"; // Ensure this line is at the top of the file

import React, { useEffect, useState } from "react";
import { getForecastData } from "../api/forecast"; // Ensure correct API import
import Nav from "../Nav"; // Ensure correct import path

export default function Forecast() {
  const [forecasts, setForecasts] = useState([]); // Store multiple forecasts
  const [showAllDetails, setShowAllDetails] = useState({}); // Store details toggle state for each forecast
  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected forecast for update/delete
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state
  const [newLat, setNewLat] = useState(""); // State for new latitude input
  const [newLon, setNewLon] = useState(""); // State for new longitude input

  useEffect(() => {
    fetchForecastData(15, 100); // Use appropriate coordinates for the default location
  }, []);

  const fetchForecastData = async (lat, lon) => {
    const newData = await getForecastData(lat, lon);
    setForecasts((prev) => {
      const isAlreadyInList = prev.some(
        (forecast) => forecast.city.id === newData.city.id
      );

      if (!isAlreadyInList) {
        return [...prev, newData]; // Add only if it's not already present
      } else {
        return prev; // No changes if already present
      }
    });
  };

  const handleAddMoreCoordinates = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleModalAddCoordinates = async () => {
    const lat = parseFloat(newLat);
    const lon = parseFloat(newLon);

    if (!isNaN(lat) && !isNaN(lon)) {
      await fetchForecastData(lat, lon); // Fetch data without replacing existing forecasts
      setNewLat(""); // Reset input fields
      setNewLon("");
      setIsModalOpen(false); // Close the modal
    } else {
      alert("Please enter valid numbers for latitude and longitude.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setNewLat(""); // Reset input fields
    setNewLon("");
  };

  const handleToggleDetails = (index) => {
    setShowAllDetails((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle details visibility for a specific forecast
    }));
  };

  const handleDeleteForecast = async (index) => {
    // Confirm deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete this forecast?"
    );
    if (confirmed) {
      setForecasts((prev) => prev.filter((_, i) => i !== index)); // Delete forecast at the given index
    }
  };

  const handleUpdateForecast = async (index) => {
    const newLat = prompt("Enter new latitude:");
    const newLon = prompt("Enter new longitude:");
    if (!isNaN(parseFloat(newLat)) && !isNaN(parseFloat(newLon))) {
      const updatedForecast = forecasts[index];
      // Here you would typically make an API call to update the forecast
      // For example: await updateForecastAPI(updatedForecast.id, { newlat: parseFloat(newLat), newlon: parseFloat(newLon) });
      console.log(
        `Updating forecast for ${updatedForecast.city.name} to new coordinates: ${newLat}, ${newLon}`
      );
      await fetchForecastData(parseFloat(newLat), parseFloat(newLon)); // Refresh the forecast list
    }
  };

  if (!forecasts.length) {
    return (
      <div className="text-center text-xl font-semibold mt-10">Loading...</div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Weather Forecast
        </h1>
        <div className="text-center mb-6">
          <button
            onClick={handleAddMoreCoordinates}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-600 transition-colors"
          >
            Add More Coordinates
          </button>
        </div>
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
                className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg"
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
                  <div className="ml-auto relative">
                    <button
                      onClick={() =>
                        setSelectedIndex(selectedIndex === index ? null : index)
                      }
                      className="text-gray-800 focus:outline-none text-3xl p-2"
                    >
                      ⋮
                    </button>
                    {selectedIndex === index && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <button
                          onClick={() => handleUpdateForecast(index)}
                          className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteForecast(index)}
                          className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add Coordinates</h2>
            <label className="block mb-2">
              Latitude:
              <input
                type="text"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </label>
            <label className="block mb-4">
              Longitude:
              <input
                type="text"
                value={newLon}
                onChange={(e) => setNewLon(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </label>
            <div className="flex justify-between">
              <button
                onClick={handleModalClose}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalAddCoordinates}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
