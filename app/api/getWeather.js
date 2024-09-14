export default async function getWeather(lat, lon) {
  const apiKey = process.env.WEATHER_API_KEY;
  try {
    console.log(process.env.KUY);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=31f7b7c1edd738be445656accc7cddc3&units=metric`
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
