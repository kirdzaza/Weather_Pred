// /api/forecast.js

export async function getForecastData(lat, lon) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Ensure this matches your expected data structure
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error; // Re-throw the error to handle it in the component
  }
}
