// /api/airQuality.js

export default async function getAirPollutionHistory(lat, lon) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  // Calculate Unix time for today and tomorrow
  const today = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000); // Start of today (midnight)
  const tomorrow = today + 86400; // Add 24 hours in seconds (86400 seconds)

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${today}&end=${tomorrow}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching air pollution data:", error);
    throw error; // Re-throw the error to handle it in the component
  }
}
