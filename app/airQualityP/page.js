"use client";

import React, { useEffect, useState } from "react";
import getAirQualityData from "../api/airQuality"; // Ensure the correct import path
import Nav from "../Nav"; // Ensure the correct import path

export default function AirQuality() {
  const [airQualityData, setAirQualityData] = useState(null);
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch air quality data (replace lat/lon with actual values)
    const fetchData = async () => {
      try {
        const data = await getAirQualityData(15, 100); // Replace with actual coordinates
        setAirQualityData(data);
      } catch (err) {
        setError("Error fetching air quality data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Air Quality
        </h1>
        <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
          {loading && <p className="text-blue-600 text-center">Loading...</p>}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {airQualityData && !loading && (
            <div className="space-y-4">
              <p className="text-xl font-semibold text-gray-700">
                Location:{" "}
                <span className="font-normal">{airQualityData.cityName}</span>
              </p>
              <p className="text-lg font-medium">
                AQI: <span className="font-normal">{airQualityData.aqi}</span>
              </p>
              <p className="text-lg font-medium">
                PM10: <span className="font-normal">{airQualityData.pm10}</span>
              </p>
              <p className="text-lg font-medium">
                PM2.5:{" "}
                <span className="font-normal">{airQualityData.pm2_5}</span>
              </p>
              <p className="text-lg font-medium">
                NO2: <span className="font-normal">{airQualityData.no2}</span>
              </p>
              <p className="text-lg font-medium">
                O3: <span className="font-normal">{airQualityData.o3}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
