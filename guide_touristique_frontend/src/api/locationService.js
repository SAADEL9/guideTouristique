import { nominatimClient } from './externalClients';

/**
 * Search for a location using Nominatim (OpenStreetMap)
 * @param {string} query - Location name (city, country, etc.)
 * @returns {Promise<Object>} Location data with lat, lon, and other details
 */
export const searchLocation = async (query) => {
  if (!query) {
    throw new Error('Query is required');
  }

  try {
    const response = await nominatimClient.get('/search', {
      params: {
        q: query,
        format: 'json'
      }
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('Location not found');
    }

    // Return the first result
    const result = response.data[0];
    return {
      name: result.name,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      displayName: result.display_name,
      placeId: result.place_id,
      type: result.type,
      boundingBox: result.boundingbox
    };
  } catch (error) {
    if (error.message === 'Location not found') throw error;
    throw new Error(`Failed to search location: ${error.message}`);
  }
};

/**
 * Get coordinates for a city (used for map centering)
 * @param {string} city - City name
 * @returns {Promise<{lat: number, lon: number}>} City coordinates
 */
export const getLocationCoordinates = async (city) => {
  const location = await searchLocation(city);
  return {
    lat: location.lat,
    lon: location.lon
  };
};
