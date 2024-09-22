"use client"; // Ensure this line is at the top of the file

import React, { useEffect, useState } from "react";
import getWeather from "../api/getWeather"; // Ensure correct API import
import Nav from "../Nav"; // Ensure correct import path

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [additionalCoordinates, setAdditionalCoordinates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLat, setNewLat] = useState("");
  const [newLon, setNewLon] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(""); // Reset error state
      try {
        // Fetch coordinates from your database
        const response = await fetch("/api/currentData", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const { current_data } = await response.json();

        // Check if current_data is not empty
        if (current_data.length === 0) {
          throw new Error("No coordinates found in the database.");
        }

        const weatherPromises = current_data.map(async (each) => {
          return await getWeather(each.lat, each.lon);
        });
        // const weatherResults = await getWeather(34, 1);

        const weatherResults = await Promise.all(weatherPromises);

        setWeatherData(weatherResults);
        // Combine the results
      } catch (err) {
        setError("Error fetching weather data: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(weatherData);

  const handleAddCoordinates = () => {
    if (!isNaN(parseFloat(newLat)) && !isNaN(parseFloat(newLon))) {
      setAdditionalCoordinates((prev) => [
        ...prev,
        { lat: parseFloat(newLat), lon: parseFloat(newLon) },
      ]);
      setNewLat("");
      setNewLon("");
      setIsModalOpen(false);
    } else {
      alert("Please enter valid numbers for latitude and longitude.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewLat("");
    setNewLon("");
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
          Current Weather
        </h1>
        <div className="text-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add More Coordinates
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {weatherData.map((each, index) => {
            return (
              <div
                key={index}
                className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={`http://openweathermap.org/img/wn/${each.weather[0].icon}.png`}
                    alt={each.weather[0].description}
                    className="w-16 h-16 mr-4"
                  />
                  <div className="text-xl font-semibold text-gray-700">
                    {each.weather[0].main}
                  </div>
                </div>
                <p className="text-gray-600">
                  <strong>Location:</strong> {each.name}, {each.sys.country}
                </p>
                <p className="text-gray-600">
                  <strong>Coordinates:</strong> Lat {each.coord.lat}, Lon{" "}
                  {each.coord.lon}
                </p>
                <p className="text-gray-600">
                  <strong>Temperature:</strong>{" "}
                  {(each.main.temp - 273.15).toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Feels Like:</strong>{" "}
                  {(each.main.feels_like - 273.15).toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Min Temperature:</strong>{" "}
                  {(each.main.temp_min - 273.15).toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Max Temperature:</strong>{" "}
                  {(each.main.temp_max - 273.15).toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Pressure:</strong> {each.main.pressure} hPa
                </p>
                <p className="text-gray-600">
                  <strong>Humidity:</strong> {each.main.humidity}%
                </p>
              </div>
            );
          })}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add Coordinates</h2>
              <input
                type="text"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                placeholder="Enter latitude"
                className="border px-3 py-1 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                value={newLon}
                onChange={(e) => setNewLon(e.target.value)}
                placeholder="Enter longitude"
                className="border px-3 py-1 rounded-lg mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddCoordinates}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Add
                </button>
                <button
                  onClick={handleModalClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
