import axiosInstance from './AxiosInstance';

/**
 * Fetch hotels for a given city
 * @param {string} city - City name
 * @returns {Promise<Array>} Array of hotel objects
 */
export const getHotels = async (city) => {
  if (!city) {
    throw new Error('City name is required');
  }

  try {
    const response = await axiosInstance.get('/places/hotels', {
      params: { city }
    });
    return response.data || [];
  } catch (error) {
    throw new Error(`Failed to fetch hotels: ${error.message}`);
  }
};

/**
 * Fetch places/attractions for a given city
 * @param {string} city - City name
 * @param {Object} options - Filter options (category, limit, etc.)
 * @returns {Promise<Array>} Array of place objects
 */
export const getPlaces = async (city, options = {}) => {
  if (!city) {
    throw new Error('City name is required');
  }

  try {
    const response = await axiosInstance.get('/places/attractions', {
      params: { city, ...options }
    });
    return response.data || [];
  } catch (error) {
    throw new Error(`Failed to fetch places: ${error.message}`);
  }
};

/**
 * Get place details
 * @param {string | number} placeId - Place ID
 * @returns {Promise<Object>} Place details
 */
export const getPlaceDetails = async (placeId) => {
  if (!placeId) {
    throw new Error('Place ID is required');
  }

  try {
    const response = await axiosInstance.get(`/places/${placeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch place details: ${error.message}`);
  }
};

/**
 * Search places by category
 * @param {string} category - Place category
 * @param {Object} filters - Search filters
 * @returns {Promise<Array>} Array of places
 */
export const searchPlacesByCategory = async (category, filters = {}) => {
  if (!category) {
    throw new Error('Category is required');
  }

  try {
    const response = await axiosInstance.get('/places/search', {
      params: { category, ...filters }
    });
    return response.data || [];
  } catch (error) {
    throw new Error(`Failed to search places: ${error.message}`);
  }
};
