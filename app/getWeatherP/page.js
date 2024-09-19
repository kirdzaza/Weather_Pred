"use client"; // Ensure this line is at the top of the file

import React, { useEffect, useState } from "react";
import getWeather from "../api/getWeather"; // Ensure correct API import
import Nav from "../Nav"; // Ensure correct import path

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState(15); // Default latitude
  const [lon, setLon] = useState(100); // Default longitude
  const [additionalCoordinates, setAdditionalCoordinates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeather(lat, lon);
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching weather data.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon]);

  const handleAddMoreCoordinates = () => {
    const newLat = parseFloat(prompt("Enter latitude:"));
    const newLon = parseFloat(prompt("Enter longitude:"));

    if (!isNaN(newLat) && !isNaN(newLon)) {
      setLat(newLat);
      setLon(newLon);
      setAdditionalCoordinates([
        ...additionalCoordinates,
        { lat: newLat, lon: newLon },
      ]);
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

  const temperature = (weatherData.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
  const weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Current Weather
        </h1>
        <button
          onClick={handleAddMoreCoordinates}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-600 transition-colors"
        >
          Add More Coordinates
        </button>
        <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <img
              src={weatherIcon}
              alt={weatherData.weather[0].description}
              className="w-16 h-16 mr-4"
            />
            <div className="text-xl font-semibold text-gray-700">
              {weatherData.weather[0].main}
            </div>
          </div>
          <p className="text-gray-600">
            <strong>Location:</strong> {weatherData.name},{" "}
            {weatherData.sys.country}
          </p>
          <p className="text-gray-600">
            <strong>Coordinates:</strong> Lat {weatherData.coord.lat}, Lon{" "}
            {weatherData.coord.lon}
          </p>
          <p className="text-gray-600">
            <strong>Temperature:</strong> {temperature}°C
          </p>
          <p className="text-gray-600">
            <strong>Feels Like:</strong>{" "}
            {(weatherData.main.feels_like - 273.15).toFixed(1)}°C
          </p>
          <p className="text-gray-600">
            <strong>Min Temperature:</strong>{" "}
            {(weatherData.main.temp_min - 273.15).toFixed(1)}°C
          </p>
          <p className="text-gray-600">
            <strong>Max Temperature:</strong>{" "}
            {(weatherData.main.temp_max - 273.15).toFixed(1)}°C
          </p>
          <p className="text-gray-600">
            <strong>Pressure:</strong> {weatherData.main.pressure} hPa
          </p>
          <p className="text-gray-600">
            <strong>Humidity:</strong> {weatherData.main.humidity}%
          </p>
        </div>
      </div>
    </div>
  );
}
