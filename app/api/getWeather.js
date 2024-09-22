export default async function getWeather(lat, lon) {
  // const apiKey = process.env.WEATHER_API_KEY;

  // if (!apiKey) {
  //   throw new Error("Weather API key is missing");
  // }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=31f7b7c1edd738be445656accc7cddc3&units=metric`
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
