"use client"; // Ensure this line is at the top of the file

import React, { useEffect, useState } from "react";
import getWeather from "../api/getWeather"; // Ensure correct API import
import getAirQuality from "../api/airQuality"; // Ensure correct API import
import Nav from "../Nav"; // Ensure correct import path

export default function AQIWeather() {
  const [weatherData, setWeatherData] = useState([]);
  const [airQualityData, setAirQualityData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoordinates, setNewCoordinates] = useState({ lat: "", lon: "" });
  const [selectedData, setSelectedData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/aqiData`
        );
        if (!response.ok) throw new Error("Error fetching data");
        const data = await response.json();
        const coords = data.aqi_data || [];

        if (coords.length > 0) {
          const weatherPromises = coords.map((coord) =>
            getWeather(coord.lat, coord.lon)
          );
          const airQualityPromises = coords.map((coord) =>
            getAirQuality(coord.lat, coord.lon)
          );
          const weatherResponses = await Promise.all(weatherPromises);
          const airQualityResponses = await Promise.all(airQualityPromises);

          const weatherWithIds = weatherResponses.map((weather, index) => ({
            ...weather,
            _id: coords[index]._id,
          }));

          setWeatherData(weatherWithIds);
          setAirQualityData(airQualityResponses);
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
    const lat = parseFloat(newCoordinates.lat);
    const lon = parseFloat(newCoordinates.lon);

    if (isNaN(lat) || isNaN(lon)) {
      setError("Please enter valid numbers for latitude and longitude.");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError(
        "Latitude must be between -90 and 90, and longitude must be between -180 and 180."
      );
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/aqiData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat, lon }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add coordinates.");
      }

      const data = await response.json();
      const weather = await getWeather(data.lat, data.lon);
      setWeatherData((prev) => [...prev, { ...weather, _id: data._id }]);
      setNewCoordinates({ lat: "", lon: "" });
      setIsModalOpen(false);
      setError(""); // Clear error
      window.location.reload();
    } catch (err) {
      setError(err.message);
      window.location.reload();
    }
  };

  const handleUpdate = async () => {
    const { lat, lon } = newCoordinates;
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      setError("Please enter valid numbers for latitude and longitude.");
      return;
    }

    if (
      parsedLat < -90 ||
      parsedLat > 90 ||
      parsedLon < -180 ||
      parsedLon > 180
    ) {
      setError(
        "Latitude must be between -90 and 90, and longitude must be between -180 and 180."
      );
      return;
    }

    try {
      if (!selectedData || !selectedData._id)
        throw new Error("No selected data to update");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/aqiData/${selectedData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newlat: parsedLat,
            newlon: parsedLon,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update coordinates.");
      }

      const updatedWeather = await getWeather(parsedLat, parsedLon);
      setWeatherData((prev) =>
        prev.map((item) =>
          item._id === selectedData._id
            ? { ...updatedWeather, _id: item._id }
            : item
        )
      );
      setNewCoordinates({ lat: "", lon: "" });
      setSelectedData(null);
      setIsModalOpen(false);
      setIsMenuOpen(false);
      setError(""); // Clear error
      window.location.reload();
    } catch (err) {
      setError(err.message);
      window.location.reload();
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/aqiData/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete data.");
      }
      setWeatherData((prev) => prev.filter((data) => data._id !== id));
      setIsMenuOpen(false);
      setError(""); // Clear error
      window.location.reload();
    } catch (err) {
      setError(err.message);
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
          Current Weather and Air Quality
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
            const airQuality = airQualityData[index];

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
                {/* Display Air Quality Data */}
                <p className="text-gray-600">
                  <strong>Carbon Monoxide:</strong>{" "}
                  {airQuality?.list[0].components.co ?? "N/A"} µg/m³
                </p>
                <p className="text-gray-600">
                  <strong>Nitric Oxide:</strong>{" "}
                  {airQuality?.list[0].components.no ?? "N/A"} µg/m³
                </p>
                <p className="text-gray-600">
                  <strong>Nitrogen Dioxide:</strong>{" "}
                  {airQuality?.list[0].components.no2 ?? "N/A"} µg/m³
                </p>
                <p className="text-gray-600">
                  <strong>Ozone:</strong>{" "}
                  {airQuality?.list[0].components.o3 ?? "N/A"} µg/m³
                </p>
                <p className="text-gray-600">
                  <strong>Sulfur Dioxide:</strong>{" "}
                  {airQuality?.list[0].components.so2 ?? "N/A"} µg/m³
                </p>
                <p className="text-gray-600">
                  <strong>Particulate Matter (PM2.5):</strong>{" "}
                  {airQuality?.list[0].components.pm2_5 ?? "N/A"} µg/m³
                </p>
                <p className="text-gray-600">
                  <strong>Particulate Matter (PM10):</strong>{" "}
                  {airQuality?.list[0].components.pm10 ?? "N/A"} µg/m³
                </p>
                <p className="text-gray-600">
                  <strong>Ammonia:</strong>{" "}
                  {airQuality?.list[0].components.nh3 ?? "N/A"} µg/m³
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
