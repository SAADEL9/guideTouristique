import axios from 'axios';

// ─── Wikipedia API Client ─────────────────────────────────────────────────
export const wikipediaClient = axios.create({
  baseURL: 'https://en.wikipedia.org/w',
  params: {
    format: 'json',
    origin: '*'
  }
});

// ─── Unsplash API Client ──────────────────────────────────────────────────
export const unsplashClient = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    'Accept-Version': 'v1'
  }
});

// Add Unsplash API key to all requests
unsplashClient.interceptors.request.use((config) => {
  const apiKey = process.env.REACT_APP_UNSPLASH_KEY;
  if (!apiKey) {
    throw new Error('Unsplash API key not configured');
  }
  config.params = {
    ...config.params,
    client_id: apiKey
  };
  return config;
});

// ─── Nominatim (OpenStreetMap) API Client ────────────────────────────────
export const nominatimClient = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  headers: {
    'User-Agent': 'tourist-guide-app'
  }
});

// ─── REST Countries API Client ────────────────────────────────────────────
export const countriesClient = axios.create({
  baseURL: 'https://restcountries.com/v3.1'
});

// ─── Open-Meteo Weather API Client ───────────────────────────────────────
export const weatherClient = axios.create({
  baseURL: 'https://api.open-meteo.com/v1'
});
