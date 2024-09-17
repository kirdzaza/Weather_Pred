import React, { useEffect, useState } from "react";
import { getAirQualityData } from "../api/airQuality"; // API to fetch air quality
import Nav from "./Nav";

export default function AirQuality() {
  const [airQualityData, setAirQualityData] = useState(null);

  useEffect(() => {
    // Fetch air quality data (replace lat/lon with actual values)
    getAirQualityData(15, 100).then(setAirQualityData);
  }, []);

  if (!airQualityData) return <div>Loading...</div>;

  return (
    <div>
      <Nav />

      <h1>Air Quality</h1>
      <p>AQI: {airQualityData.aqi}</p>
      <p>PM10: {airQualityData.pm10}</p>
      <p>PM2.5: {airQualityData.pm2_5}</p>
      <p>NO2: {airQualityData.no2}</p>
      <p>O3: {airQualityData.o3}</p>
    </div>
  );
}
