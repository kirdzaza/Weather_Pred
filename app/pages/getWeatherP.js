import React, { useEffect, useState } from "react";
import { getCurrentWeatherData } from "../api/weather"; // API to fetch current weather
import Nav from "./Nav";

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Fetch current weather data (replace lat/lon with actual values)
    getCurrentWeatherData(37.7749, -122.4194).then(setWeatherData);
  }, []);

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div>
      <Nav />

      <h1>Current Weather</h1>
      <p>Temperature: {weatherData.temperature}°C</p>
      <p>Weather: {weatherData.description}</p>
      <p>Humidity: {weatherData.humidity}%</p>
      <p>Wind Speed: {weatherData.windSpeed} m/s</p>
    </div>
  );
}
