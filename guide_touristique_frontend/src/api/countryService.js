import { countriesClient } from './externalClients';

/**
 * Search for a country by name
 * @param {string} countryName - Country name
 * @returns {Promise<Object>} Country data
 */
export const searchCountry = async (countryName) => {
  if (!countryName) {
    throw new Error('Country name is required');
  }

  try {
    const response = await countriesClient.get(`/name/${countryName}`);

    if (!response.data || response.data.length === 0) {
      throw new Error('Country not found');
    }

    // Return the first result with essential data
    const country = response.data[0];
    return {
      name: country.name.common,
      officialName: country.name.official,
      capital: country.capital?.[0] || '',
      region: country.region || '',
      subregion: country.subregion || '',
      population: country.population || 0,
      area: country.area || 0,
      languages: country.languages || {},
      currencies: country.currencies || {},
      flags: country.flags || {},
      coatOfArms: country.coatOfArms || {},
      latlng: country.latlng || [],
      timezones: country.timezones || [],
      borders: country.borders || [],
      independent: country.independent || false
    };
  } catch (error) {
    if (error.message === 'Country not found') throw error;
    throw new Error(`Failed to fetch country data: ${error.message}`);
  }
};

/**
 * Get all countries (if needed for a list)
 * @returns {Promise<Array>} Array of all countries
 */
export const getAllCountries = async () => {
  try {
    const response = await countriesClient.get('/all');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch countries list: ${error.message}`);
  }
};
