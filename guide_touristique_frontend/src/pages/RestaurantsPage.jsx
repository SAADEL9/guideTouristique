import React, { useState } from 'react';
import axiosInstance from '../api/AxiosInstance';

const palette = {
  bg: '#f8fafc',
  surface: '#ffffff',
  accent: '#0284c7',
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
};

const RestaurantsPage = () => {
  const [city, setCity] = useState('');
  const [searchedCity, setSearchedCity] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    setSearchedCity(city.trim());
    try {
      const res = await axiosInstance.get('/places/restaurants', { params: { city: city.trim() } });
      setRestaurants(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: palette.bg,
      color: palette.text,
      padding: '32px 24px 64px',
      boxSizing: 'border-box',
    },
    inner: {
      maxWidth: '1100px',
      margin: '0 auto',
    },
    title: {
      fontSize: 'clamp(32px, 5vw, 44px)',
      fontWeight: 900,
      color: palette.text,
      margin: '0 0 8px',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      color: palette.muted,
      fontSize: '16px',
      marginBottom: '28px',
    },
    searchOuter: {
      width: '100%',
      maxWidth: '700px',
      marginBottom: '36px',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '56px',
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderRadius: '999px',
      paddingLeft: '22px',
      paddingRight: '6px',
      boxSizing: 'border-box',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
    },
    searchInput: {
      flex: 1,
      minWidth: 0,
      height: '100%',
      border: 'none',
      background: 'transparent',
      color: palette.text,
      fontSize: '17px',
      outline: 'none',
    },
    searchBtn: {
      background: palette.accent,
      color: '#ffffff',
      borderRadius: '999px',
      padding: '11px 28px',
      border: 'none',
      fontWeight: 700,
      fontSize: '15px',
      cursor: 'pointer',
      flexShrink: 0,
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    card: {
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderRadius: '14px',
      padding: '22px',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
    },
    name: {
      color: palette.text,
      fontSize: '17px',
      fontWeight: 700,
      margin: 0,
    },
    address: {
      color: palette.muted,
      fontSize: '14px',
      marginTop: '8px',
      lineHeight: 1.5,
    },
    centerMuted: {
      textAlign: 'center',
      color: palette.muted,
      marginTop: '40px',
      fontSize: '15px',
    },
    centerError: {
      textAlign: 'center',
      color: '#dc2626',
      marginTop: '20px',
      fontSize: '15px',
      fontWeight: 600,
    },
  };

  const showEmpty =
    !loading && !error && searchedCity && Array.isArray(restaurants) && restaurants.length === 0;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.title}>🍽️ Restaurants</h1>
        <p style={styles.subtitle}>Search by city to see places to eat nearby.</p>

        <div style={styles.searchOuter}>
          <div style={styles.searchBar}>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Enter a city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button type="button" style={styles.searchBtn} onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {loading && <p style={styles.centerMuted}>Loading...</p>}
        {error && <p style={styles.centerError}>{error}</p>}

        {showEmpty && (
          <p style={styles.centerMuted}>No restaurants found in {searchedCity}</p>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div style={styles.grid}>
            {restaurants.map((r, idx) => (
              <div
                key={r.id ?? `${r.name}-${r.address}-${idx}`}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = palette.accent;
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(2, 132, 199, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = palette.border;
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.05)';
                }}
              >
                <p style={styles.name}>{r.name || 'Restaurant'}</p>
                <p style={styles.address}>📍 {r.address || 'Address not available'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
