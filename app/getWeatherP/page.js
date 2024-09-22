"use client";

import React, { useEffect, useState } from "react";
import getWeather from "../api/getWeather";
import Nav from "../Nav";

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCoordinates, setNewCoordinates] = useState({ lat: "", lon: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/currentData");
        if (!response.ok) throw new Error("Error fetching data");
        const data = await response.json();
        const coords = data.current_data || [];

        if (coords.length > 0) {
          const weatherPromises = coords.map((coord) =>
            getWeather(coord.lat, coord.lon)
          );
          const weatherResponses = await Promise.all(weatherPromises);
          setWeatherData(weatherResponses);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCoordinates = async () => {
    const { lat, lon } = newCoordinates;
    if (isNaN(lat) || isNaN(lon)) {
      alert("Please enter valid numbers for latitude and longitude.");
      return;
    }

    try {
      const response = await fetch("/api/currentData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat: parseFloat(lat), lon: parseFloat(lon) }),
      });

      if (!response.ok) throw new Error("Error adding coordinates");
      const data = await response.json();
      const weather = await getWeather(data.lat, data.lon);
      setWeatherData((prev) => [...prev, weather]);
      setNewCoordinates({ lat: "", lon: "" });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleUpdate = async () => {
    const { lat, lon } = newCoordinates;
    if (isNaN(lat) || isNaN(lon)) {
      alert("Please enter valid numbers for latitude and longitude.");
      return;
    }

    try {
      const response = await fetch(`/api/currentData/${selectedData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newlat: parseFloat(lat),
          newlon: parseFloat(lon),
        }), // Sending newlat and newlon
      });

      if (!response.ok) throw new Error("Error updating coordinates");
      const updatedWeather = await getWeather(lat, lon);
      setWeatherData((prev) =>
        prev.map((item) =>
          item._id === selectedData._id ? updatedWeather : item
        )
      );
      setNewCoordinates({ lat: "", lon: "" }); // Clear inputs
      setSelectedData(null); // Close modal
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedData) return;

    try {
      const response = await fetch(`/api/currentData/${selectedData._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error deleting data");
      setWeatherData((prev) =>
        prev.filter((data) => data._id !== selectedData._id)
      );
      setSelectedData(null); // Close modal
    } catch (err) {
      console.error(err);
      alert(err.message);
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
          Current Weather
        </h1>
        {weatherData.length === 0 ? (
          <div className="text-center mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add More Coordinates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {weatherData.map((data) => {
              const temperature = data.main.temp.toFixed(1);
              const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

              return (
                <div
                  key={data._id}
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
                    <button
                      onClick={() => setSelectedData(data)}
                      className="ml-auto text-gray-600"
                    >
                      ⋮
                    </button>
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
                    <strong>Feels Like:</strong>{" "}
                    {data.main.feels_like.toFixed(1)}°C
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
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add Coordinates</h2>
              <input
                type="text"
                value={newCoordinates.lat}
                onChange={(e) =>
                  setNewCoordinates({ ...newCoordinates, lat: e.target.value })
                }
                placeholder="Enter latitude"
                className="border px-3 py-1 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                value={newCoordinates.lon}
                onChange={(e) =>
                  setNewCoordinates({ ...newCoordinates, lon: e.target.value })
                }
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
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedData && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Options</h2>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedData(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
