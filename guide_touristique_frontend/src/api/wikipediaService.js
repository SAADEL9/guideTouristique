import { wikipediaClient } from './externalClients';

/**
 * Fetch Wikipedia description for a given query
 * @param {string} query - Search term (typically a location or person name)
 * @returns {Promise<string>} Wikipedia article extract
 */
export const fetchWikiDescription = async (query) => {
  if (!query) {
    throw new Error('Query is required');
  }

  try {
    const response = await wikipediaClient.get('/api.php', {
      params: {
        action: 'query',
        prop: 'extracts',
        exintro: true,
        explaintext: true,
        titles: query
      }
    });

    // Wikipedia returns an object with pages, the key is the page ID
    const pages = response.data.query.pages;
    const page = Object.values(pages)[0]; // get the first (only) result

    if (page.missing !== undefined) {
      throw new Error('No description found');
    }

    return page.extract || '';
  } catch (error) {
    throw new Error(`Failed to fetch Wikipedia data: ${error.message}`);
  }
};
