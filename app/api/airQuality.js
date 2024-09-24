// /api/airQuality.js

export default async function getWeather(lat, lon) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Re-throw the error to handle it in the component
  }
}
