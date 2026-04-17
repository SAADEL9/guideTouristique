import { unsplashClient } from './externalClients';

/**
 * Search for images on Unsplash
 * @param {string} query - Search term
 * @param {number} perPage - Results per page (default: 8)
 * @returns {Promise<Array>} Array of image objects
 */
export const searchImages = async (query, perPage = 8) => {
  if (!query) {
    throw new Error('Query is required');
  }

  try {
    const response = await unsplashClient.get('/search/photos', {
      params: {
        query: encodeURIComponent(query),
        per_page: perPage
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      return [];
    }

    return response.data.results;
  } catch (error) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
};
