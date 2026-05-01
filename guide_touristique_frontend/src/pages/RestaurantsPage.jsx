import React, { useState } from 'react';
import axiosInstance from '../api/AxiosInstance';

const CORAL = '#FF6B35';
const BG = '#FAFAFA';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';

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

  const showEmpty = !loading && !error && searchedCity && Array.isArray(restaurants) && restaurants.length === 0;

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT }}>
      {/* Page header */}
      <div style={{ background: HERO_BG, borderBottom: `0.5px solid ${BORDER}`, textAlign: 'center', padding: '48px 24px 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ACCENT_LIGHT, color: CORAL, borderRadius: 999, padding: '5px 14px', fontSize: 12, fontWeight: 500, marginBottom: 16 }}>
          🍽️ Dining
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', fontWeight: 500, color: TEXT, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Find restaurants</h1>
        <p style={{ color: MUTED, fontSize: 14, margin: '0 0 24px' }}>Search by city to find places to eat nearby</p>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: 999, padding: '6px 6px 6px 20px', maxWidth: 500, margin: '0 auto' }}>
          <input
            style={{ flex: 1, border: 'none', background: 'transparent', color: TEXT, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            type="text"
            placeholder="Enter a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            type="button"
            onClick={handleSearch}
            style={{ background: CORAL, color: WHITE, borderRadius: 999, padding: '9px 22px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: 'inherit' }}
          >
            Search
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 64px' }}>
        {loading && <p style={{ textAlign: 'center', color: MUTED, padding: '40px 0' }}>Loading...</p>}
        {error && <p style={{ textAlign: 'center', color: '#dc2626', padding: '20px 0' }}>{error}</p>}
        {showEmpty && <p style={{ textAlign: 'center', color: MUTED, padding: '40px 0' }}>No restaurants found in {searchedCity}</p>}

        {!loading && !error && restaurants.length === 0 && !searchedCity && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
            <p style={{ color: MUTED, fontSize: 14 }}>Search a city above to discover restaurants</p>
          </div>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {restaurants.map((r, idx) => (
              <div
                key={r.id ?? `${r.name}-${idx}`}
                style={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '20px 22px', transition: 'border-color 0.15s, background 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FFD4C2'; e.currentTarget.style.background = HERO_BG; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = WHITE; }}
              >
                <p style={{ fontSize: 15, fontWeight: 500, color: TEXT, margin: '0 0 6px' }}>{r.name || 'Restaurant'}</p>
                <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.5 }}>📍 {r.address || 'Address not available'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
