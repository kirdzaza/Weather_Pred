"use client";

import React, { useEffect, useState } from "react";
import { getForecastData } from "../api/forecast";
import Nav from "../Nav";

export default function Forecast() {
  const [forecasts, setForecasts] = useState([]);
  const [showAllDetails, setShowAllDetails] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newCoordinates, setNewCoordinates] = useState({ lat: "", lon: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/forecastData");
        if (!response.ok) throw new Error("Error fetching coordinates");
        const data = await response.json();
        const coords = data.forecast_data || [];

        if (coords.length === 0) throw new Error("No coordinates available.");

        const weatherPromises = coords.map((coord) =>
          getForecastData(coord.lat, coord.lon)
        );
        const weatherResponses = await Promise.all(weatherPromises);
        const forecastsWithIds = weatherResponses.map((weather, index) => ({
          ...weather,
          _id: coords[index]._id,
        }));
        setForecasts(forecastsWithIds);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, []);

  const handleAddCoordinates = async () => {
    const lat = parseFloat(newCoordinates.lat);
    const lon = parseFloat(newCoordinates.lon);
    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      setError("Please enter valid latitude and longitude.");
      return;
    }

    try {
      const response = await fetch("/api/forecastData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lon }),
      });
      if (!response.ok) throw new Error("Failed to add coordinates.");

      const data = await response.json();
      const weather = await getForecastData(data.lat, data.lon);
      setForecasts((prev) => [...prev, { ...weather, _id: data._id }]);
      setNewCoordinates({ lat: "", lon: "" });
      setIsModalOpen(false);
      setError(null);
      window.location.reload();
    } catch (err) {
      console.error(err);
      window.location.reload();
    }
  };

  const handleUpdate = async () => {
    const lat = parseFloat(newCoordinates.lat);
    const lon = parseFloat(newCoordinates.lon);
    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      alert("Please enter valid latitude and longitude.");
      return;
    }

    try {
      if (selectedIndex === null || !forecasts[selectedIndex]._id)
        throw new Error("No selected data to update");

      const response = await fetch(
        `/api/forecastData/${forecasts[selectedIndex]._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newlat: lat,
            newlon: lon,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error updating coordinates: ${
            errorData.message || response.statusText
          }`
        );
      }

      const updatedWeather = await getForecastData(lat, lon);
      setForecasts((prev) =>
        prev.map((item, index) =>
          index === selectedIndex ? { ...updatedWeather, _id: item._id } : item
        )
      );
      setNewCoordinates({ lat: "", lon: "" });
      setSelectedIndex(null);
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/forecastData/?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete data.");
      setForecasts((prev) => prev.filter((data) => data._id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMenu = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setIsMenuOpen(false);
    } else {
      setSelectedIndex(index);
      setSelectedData(forecasts[index]);
      setIsMenuOpen(true);
    }
  };

  if (loading)
    return (
      <div className="text-center text-xl font-semibold mt-10">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center text-xl font-semibold mt-10 text-red-600">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Weather Forecast
        </h1>
        <div className="text-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-600 transition-colors"
          >
            Add More Coordinates
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6">
          {forecasts.map((forecastData, index) => {
            const currentForecast = forecastData.list[0];
            const temperature = (currentForecast.main.temp - 273.15).toFixed(1);
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
                    {forecastData.city.name}, {forecastData.city.country}
                  </div>
                  <button
                    onClick={() => toggleMenu(index)}
                    className="text-gray-800 focus:outline-none text-3xl p-2 ml-auto"
                  >
                    ⋮
                  </button>
                </div>
                <p className="text-gray-600">
                  <strong>Location:</strong> {forecastData.city.name},{" "}
                  {forecastData.city.country}
                </p>
                <p className="text-gray-600">
                  <strong>Coordinates:</strong> Lat{" "}
                  {forecastData.city.coord.lat}, Lon{" "}
                  {forecastData.city.coord.lon}
                </p>
                <p className="text-gray-600">
                  <strong>Temperature:</strong> {temperature}°C
                </p>
                <p className="text-gray-600">
                  <strong>Feels Like:</strong>{" "}
                  {(currentForecast.main.feels_like - 273.15).toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Min Temperature:</strong>{" "}
                  {(currentForecast.main.temp_min - 273.15).toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Max Temperature:</strong>{" "}
                  {(currentForecast.main.temp_max - 273.15).toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Pressure:</strong> {currentForecast.main.pressure} hPa
                </p>
                <p className="text-gray-600">
                  <strong>Humidity:</strong> {currentForecast.main.humidity}%
                </p>
                <button
                  onClick={() =>
                    setShowAllDetails((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  {showAllDetails[index] ? "Show Less" : "More Details"}
                </button>
                {showAllDetails[index] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {forecastData.list.slice(1).map((entry, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg"
                      >
                        <div className="flex items-center mb-4">
                          <img
                            src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`}
                            alt={entry.weather[0].description}
                            className="w-12 h-12 mr-4"
                          />
                          <div className="text-xl font-semibold text-gray-700">
                            {forecastData.city.name}
                          </div>
                        </div>
                        <p className="text-gray-600">
                          <strong>Location:</strong> {forecastData.city.name},{" "}
                          {forecastData.city.country}
                        </p>
                        <p className="text-gray-600">
                          <strong>Coordinates:</strong> Lat{" "}
                          {forecastData.city.coord.lat}, Lon{" "}
                          {forecastData.city.coord.lon}
                        </p>
                        <p className="text-gray-600">
                          <strong>Temperature:</strong>{" "}
                          {(entry.main.temp - 273.15).toFixed(1)}°C
                        </p>
                        <p className="text-gray-600">
                          <strong>Feels Like:</strong>{" "}
                          {(currentForecast.main.feels_like - 273.15).toFixed(
                            1
                          )}
                          °C
                        </p>
                        <p className="text-gray-600">
                          <strong>Min Temperature:</strong>{" "}
                          {(currentForecast.main.temp_min - 273.15).toFixed(1)}
                          °C
                        </p>
                        <p className="text-gray-600">
                          <strong>Max Temperature:</strong>{" "}
                          {(currentForecast.main.temp_max - 273.15).toFixed(1)}
                          °C
                        </p>
                        <p className="text-gray-600">
                          <strong>Pressure:</strong>{" "}
                          {currentForecast.main.pressure} hPa
                        </p>
                        <p className="text-gray-600">
                          <strong>Humidity:</strong>{" "}
                          {currentForecast.main.humidity}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {isMenuOpen && selectedData && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Actions</h2>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setNewCoordinates({
                      lat: selectedData.city.coord.lat,
                      lon: selectedData.city.coord.lon,
                    });
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedData._id);
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                {selectedData ? "Update Coordinates" : "Add Coordinates"}
              </h2>
              <input
                type="text"
                value={newCoordinates.lat}
                onChange={(e) =>
                  setNewCoordinates({ ...newCoordinates, lat: e.target.value })
                }
                placeholder="Latitude"
                className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
              />
              <input
                type="text"
                value={newCoordinates.lon}
                onChange={(e) =>
                  setNewCoordinates({ ...newCoordinates, lon: e.target.value })
                }
                placeholder="Longitude"
                className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedData ? handleUpdate : handleAddCoordinates}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  {selectedData ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
