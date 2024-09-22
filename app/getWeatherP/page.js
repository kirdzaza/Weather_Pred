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
    const fetchLatLonData = async () => {
      try {
        const response = await fetch("/api/currentData"); // Adjust the API endpoint as needed
        const latLonData = await response.json();

        // Fetch weather data for the fetched lat/lon
        const weatherPromises = latLonData.current_data.map((coord) =>
          getWeather(coord.lat, coord.lon)
        );
        const weatherResults = await Promise.all(weatherPromises);

        setWeatherData(weatherResults);
        setLoading(false);
      } catch (err) {
        setError("Error fetching latitude and longitude data.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchLatLonData();
  }, []);

  const handleAddCoordinates = () => {
    if (!isNaN(parseFloat(newLat)) && !isNaN(parseFloat(newLon))) {
      setAdditionalCoordinates([
        ...additionalCoordinates,
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
          {weatherData.map((data, index) => {
            const temperature = data.main.temp.toFixed(1);
            const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

            return (
              <div
                key={index}
                className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={weatherIcon}
                    alt={data.weather[0].description}
                    className="w-16 h-16 mr-4"
                  />
                  <div className="text-xl font-semibold text-gray-700">
                    {data.weather[0].main}
                  </div>
                </div>
                <p className="text-gray-600">
                  <strong>Location:</strong> {data.name}, {data.sys.country}
                </p>
                <p className="text-gray-600">
                  <strong>Coordinates:</strong> Lat {data.coord.lat}, Lon{" "}
                  {data.coord.lon}
                </p>
                <p className="text-gray-600">
                  <strong>Temperature:</strong> {temperature}°C
                </p>
                <p className="text-gray-600">
                  <strong>Feels Like:</strong> {data.main.feels_like.toFixed(1)}
                  °C
                </p>
                <p className="text-gray-600">
                  <strong>Min Temperature:</strong>{" "}
                  {data.main.temp_min.toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Max Temperature:</strong>{" "}
                  {data.main.temp_max.toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <strong>Pressure:</strong> {data.main.pressure} hPa
                </p>
                <p className="text-gray-600">
                  <strong>Humidity:</strong> {data.main.humidity}%
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
