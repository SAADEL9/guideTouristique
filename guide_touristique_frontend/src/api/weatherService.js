import { weatherClient } from './externalClients';

/**
 * Get current weather for a location
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} Current weather data
 */
export const getCurrentWeather = async (latitude, longitude) => {
  if (latitude === undefined || longitude === undefined) {
    throw new Error('Latitude and longitude are required');
  }

  try {
    const response = await weatherClient.get('/forecast', {
      params: {
        latitude,
        longitude,
        current_weather: true
      }
    });

    if (!response.data.current_weather) {
      throw new Error('No weather data available');
    }

    const weather = response.data.current_weather;
    return {
      temperature: weather.temperature,
      windSpeed: weather.windspeed,
      windDirection: weather.winddirection,
      weatherCode: weather.weathercode,
      time: weather.time,
      isDay: weather.is_day
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

/**
 * Get weather forecast for a location
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {Object} options - Additional options (days, timezone, etc.)
 * @returns {Promise<Object>} Full forecast data
 */
export const getWeatherForecast = async (latitude, longitude, options = {}) => {
  if (latitude === undefined || longitude === undefined) {
    throw new Error('Latitude and longitude are required');
  }

  try {
    const response = await weatherClient.get('/forecast', {
      params: {
        latitude,
        longitude,
        current_weather: true,
        hourly: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
        ...options
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch weather forecast: ${error.message}`);
  }
};
