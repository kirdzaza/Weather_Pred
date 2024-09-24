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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for the menu

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/currentData`
        );
        if (!response.ok) throw new Error("Error fetching data");
        const data = await response.json();
        const coords = data.current_data || [];

        if (coords.length > 0) {
          const weatherPromises = coords.map((coord) =>
            getWeather(coord.lat, coord.lon)
          );
          const weatherResponses = await Promise.all(weatherPromises);

          const weatherWithIds = weatherResponses.map((weather, index) => ({
            ...weather,
            _id: coords[index]._id,
          }));
          setWeatherData(weatherWithIds);
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

    console.log("Adding coordinates:", {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/currentData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat: parseFloat(lat), lon: parseFloat(lon) }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error adding coordinates: ${
            errorData.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      const weather = await getWeather(data.lat, data.lon);
      setWeatherData((prev) => [...prev, { ...weather, _id: data._id }]);
      setNewCoordinates({ lat: "", lon: "" });
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      window.location.reload(); // Refresh the page on error
    }
  };

  const handleUpdate = async () => {
    const { lat, lon } = newCoordinates;
    if (isNaN(lat) || isNaN(lon)) {
      alert("Please enter valid numbers for latitude and longitude.");
      return;
    }

    console.log("Updating coordinates:", {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });

    try {
      if (!selectedData || !selectedData._id)
        throw new Error("No selected data to update");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/currentData/${selectedData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newlat: parseFloat(lat),
            newlon: parseFloat(lon),
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

      const updatedWeather = await getWeather(lat, lon);
      setWeatherData((prev) =>
        prev.map((item) =>
          item._id === selectedData._id
            ? { ...updatedWeather, _id: item._id }
            : item
        )
      );
      setNewCoordinates({ lat: "", lon: "" });
      setSelectedData(null);
      setIsModalOpen(false); // Close the modal
      setIsMenuOpen(false); // Close the menu
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.message);
      window.location.reload();
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/currentData/?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error deleting data: ${errorData.message || response.statusText}`
        );
      }
      setWeatherData((prev) => prev.filter((data) => data._id !== id));
      setIsMenuOpen(false); // Close the menu
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.message);
      window.location.reload();
    }
  };

  const toggleMenu = (data) => {
    setSelectedData(data);
    setIsMenuOpen(!isMenuOpen);
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

        {weatherData.length > 0 && (
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
                      onClick={() => toggleMenu(data)}
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

        {isMenuOpen && selectedData && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Actions</h2>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setNewCoordinates({
                      lat: selectedData.coord.lat,
                      lon: selectedData.coord.lon,
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
      </div>
    </div>
  );
}
