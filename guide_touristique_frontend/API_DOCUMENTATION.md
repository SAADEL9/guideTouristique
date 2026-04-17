# API Layer Documentation

## Overview

The API layer is organized into modular services, each responsible for communicating with a specific external API or backend endpoint. All services use **axios** for HTTP requests with consistent error handling and interceptors.

## Project Structure

```
src/api/
├── AxiosInstance.js          # Backend API client with JWT interceptor
├── externalClients.js        # External API client instances (configured axios)
├── index.js                  # API layer exports and documentation
├── wikipediaService.js       # Wikipedia API integration
├── unsplashService.js        # Unsplash image search integration
├── locationService.js        # Nominatim/OSM location search integration
├── countryService.js         # REST Countries API integration
├── weatherService.js         # Open-Meteo weather API integration
└── placesService.js          # Backend places/hotels API integration
```

## Service APIs

### 1. Backend Services (with Authentication)

#### `placesService.js`
Uses the authenticated `axiosInstance` with JWT tokens.

```javascript
import { getHotels, getPlaces, getPlaceDetails } from '../api/placesService';

// Fetch hotels in a city
const hotels = await getHotels('Paris');

// Fetch attractions
const attractions = await getPlaces('Tokyo', { category: 'museums' });

// Get specific place details
const details = await getPlaceDetails(placeId);
```

### 2. External API Services

#### `wikipediaService.js`
Fetch article descriptions from Wikipedia.

```javascript
import { fetchWikiDescription } from '../api/wikipediaService';

const description = await fetchWikiDescription('Paris');
```

#### `unsplashService.js`
Search and retrieve images from Unsplash.

```javascript
import { searchImages } from '../api/unsplashService';

const images = await searchImages('mountain landscape', 8);
```

#### `locationService.js`
Search for locations and get coordinates using Nominatim (OpenStreetMap).

```javascript
import { searchLocation, getLocationCoordinates } from '../api/locationService';

// Get full location data
const location = await searchLocation('Paris, France');
// { name, lat, lon, displayName, placeId, type, boundingBox }

// Get just coordinates
const coords = await getLocationCoordinates('Tokyo');
// { lat, lon }
```

#### `countryService.js`
Fetch country information.

```javascript
import { searchCountry, getAllCountries } from '../api/countryService';

// Search for a specific country
const france = await searchCountry('France');
// { name, capital, region, population, area, languages, currencies, flags, ... }

// Get all countries
const allCountries = await getAllCountries();
```

#### `weatherService.js`
Get current weather and forecast data.

```javascript
import { getCurrentWeather, getWeatherForecast } from '../api/weatherService';

// Get current weather
const weather = await getCurrentWeather(48.8566, 2.3522); // Paris coordinates
// { temperature, windSpeed, windDirection, weatherCode, time, isDay }

// Get full forecast
const forecast = await getWeatherForecast(48.8566, 2.3522, { days: 7 });
```

### 3. Authentication Service

```javascript
import authService from '../api';

authService.login(username, password);
authService.register(username, email, password);
authService.saveToken(token);
authService.getToken();
authService.removeToken();
```

## Features

### Error Handling
All services throw descriptive errors that can be caught and displayed to users:

```javascript
try {
  const country = await searchCountry('InvalidCountry');
} catch (error) {
  console.error(error.message); // "Country not found" or "Failed to fetch..."
}
```

### Request Interceptors
- **Backend API**: Automatically attaches JWT token from localStorage
- **Unsplash API**: Automatically includes API key

### Response Interceptors
- **Backend API**: Handles 401 errors by clearing auth and redirecting to login

### Axios Client Instances
Direct access to configured axios clients (if needed):

```javascript
import { wikipediaClient, unsplashClient, weatherClient } from '../api';

// Use clients directly for custom requests
const response = await wikipediaClient.get('/...', { params: {...} });
```

## Usage in Components

### Example: HomePage Component
```javascript
import { searchCountry, searchLocation, getCurrentWeather } from '../api';

const handleSearch = async () => {
  try {
    const country = await searchCountry(query);
    setCountry(country);
  } catch (error) {
    setError(error.message);
  }
};

const handleWeatherSearch = async () => {
  try {
    const location = await searchLocation(city);
    const weather = await getCurrentWeather(location.lat, location.lon);
    setWeather(weather);
  } catch (error) {
    setError(error.message);
  }
};
```

### Example: Custom Hook
```javascript
import { useEffect, useState } from 'react';
import { searchImages } from '../api';

export const useImageSearch = (query) => {
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    searchImages(query)
      .then(setImages)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  return { images, loading, error };
};
```

## API Configuration

### Environment Variables
```env
REACT_APP_UNSPLASH_KEY=your_unsplash_api_key
```

### Backend API
- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT token in Authorization header
- **Token Storage**: `localStorage.token`

### External APIs
- **Wikipedia**: https://en.wikipedia.org/w/api.php
- **Unsplash**: https://api.unsplash.com
- **Nominatim**: https://nominatim.openstreetmap.org
- **REST Countries**: https://restcountries.com/v3.1
- **Open-Meteo Weather**: https://api.open-meteo.com/v1

## Adding New Services

1. Create a new service file in `src/api/`
2. Create or use an existing client from `externalClients.js`
3. Export your service functions
4. Update `src/api/index.js` to export the new service
5. Use the service in components

Example:
```javascript
// src/api/newService.js
import { newClient } from './externalClients';

export const fetchData = async (params) => {
  try {
    const response = await newClient.get('/endpoint', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }
};
```

## Best Practices

1. **Always use try-catch** when calling API services
2. **Handle loading states** for better UX
3. **Don't expose raw responses** - transform data in services
4. **Use descriptive error messages** for user feedback
5. **Avoid fetch** - use axios services instead
6. **Keep services focused** - each service handles one API
7. **Use TypeScript** for better type safety (future improvement)

## Migration Guide

If migrating from old `fetch` calls:

### Before (fetch)
```javascript
const response = await fetch(`https://api.unsplash.com/...`);
const data = await response.json();
```

### After (axios service)
```javascript
import { searchImages } from '../api';
const images = await searchImages(query);
```

## Debugging

Enable axios logging:
```javascript
// In development
import axios from 'axios';
axios.interceptors.request.use(config => {
  console.log('Request:', config);
  return config;
});
```

Check localStorage:
```javascript
localStorage.getItem('token');  // Backend JWT token
```
