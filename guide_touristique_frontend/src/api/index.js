/**
 * API Layer Index
 * 
 * This module exports all API services and clients for the Tourist Guide application.
 * All external API calls use axios for consistent error handling and interceptors.
 */

// ─── Client Instances ───────────────────────────────────────────────────────
export { 
  wikipediaClient, 
  unsplashClient, 
  nominatimClient, 
  countriesClient, 
  weatherClient 
} from './externalClients';

// ─── Backend API Client with JWT interceptors ───────────────────────────────
export { default as axiosInstance } from './AxiosInstance';

// ─── External API Services ──────────────────────────────────────────────────
// Wikipedia Service
export { fetchWikiDescription } from './wikipediaService';

// Unsplash Image Service
export { searchImages } from './unsplashService';

// Location / Nominatim Service
export { 
  searchLocation, 
  getLocationCoordinates 
} from './locationService';

// Country Information Service
export { 
  searchCountry, 
  getAllCountries 
} from './countryService';

// Weather Service
export { 
  getCurrentWeather, 
  getWeatherForecast 
} from './weatherService';

// ─── Backend Places API Service ──────────────────────────────────────────────
// Hotels, Attractions, and other places
export { 
  getHotels, 
  getPlaces, 
  getPlaceDetails, 
  searchPlacesByCategory 
} from './placesService';

// ─── Authentication Service ─────────────────────────────────────────────────
// User authentication and token management
export { default as authService } from '../service/authService';
