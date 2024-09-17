export default async function getWeather(lat, lon) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  try {
    const response = await fetch(
      `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${apiKey}`
      // i know that my api keys was leaks but i cant hide it in .env file cause WEATHER_API_KEY=my_key its not work.
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
