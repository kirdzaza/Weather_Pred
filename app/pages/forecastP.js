import React, { useEffect, useState } from "react";
import { getForecastData } from "../api/forecast"; // API to fetch forecast
import Nav from "./Nav";

export default function Forecast() {
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    // Fetch forecast data (replace lat/lon with actual values)
    getForecastData(37.7749, -122.4194).then(setForecastData);
  }, []);

  if (!forecastData) return <div>Loading...</div>;

  return (
    <div>
      <Nav />

      <h1>Weather Forecast</h1>
      {forecastData.forecast.map((day, index) => (
        <div key={index}>
          <p>Date: {new Date(day.date).toLocaleDateString()}</p>
          <p>Temperature: {day.temperature}°C</p>
          <p>Weather: {day.description}</p>
        </div>
      ))}
    </div>
  );
}
