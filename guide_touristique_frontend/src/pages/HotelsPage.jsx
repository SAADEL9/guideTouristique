import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLiteApi from '../hooks/useLiteApi';

const CORAL = '#FF6B35';
const BG = '#FAFAFA';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';

const HotelsPage = () => {
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('MA');
  const { hotels, loading, error, search } = useLiteApi();
  const navigate = useNavigate();

  const handleSearch = () => { if (city) search(city, countryCode); };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT }}>
      {/* Page header */}
      <div style={{ background: HERO_BG, borderBottom: `0.5px solid ${BORDER}`, textAlign: 'center', padding: '48px 24px 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ACCENT_LIGHT, color: CORAL, borderRadius: 999, padding: '5px 14px', fontSize: 12, fontWeight: 500, marginBottom: 16 }}>
          🏨 Accommodation
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', fontWeight: 500, color: TEXT, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Find hotels</h1>
        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Search by city and country code to browse stays</p>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: 999, padding: '6px 6px 6px 18px', gap: 8 }}>
            <input
              style={{ border: 'none', background: 'transparent', color: TEXT, fontSize: 14, outline: 'none', width: 200, fontFamily: 'inherit' }}
              placeholder="City (e.g. Casablanca)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <input
              style={{ border: 'none', background: 'transparent', color: TEXT, fontSize: 14, outline: 'none', width: 40, textAlign: 'center', fontFamily: 'inherit' }}
              placeholder="MA"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              maxLength={2}
            />
            <button
              onClick={handleSearch}
              style={{ background: CORAL, color: WHITE, borderRadius: 999, padding: '9px 22px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: 'inherit' }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        {loading && <p style={{ textAlign: 'center', color: MUTED, padding: '40px 0' }}>Loading hotels...</p>}
        {error && <p style={{ textAlign: 'center', color: '#dc2626', padding: '20px 0' }}>{error}</p>}

        {!loading && !error && hotels.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏨</div>
            <p style={{ color: MUTED, fontSize: 14 }}>Search a city above to discover hotels</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {hotels.map((hotel) => (
            <div
              key={hotel.hotelId}
              onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
              style={{ background: WHITE, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: `0.5px solid ${BORDER}`, transition: 'border-color 0.15s, background 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FFD4C2'; e.currentTarget.style.background = HERO_BG; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = WHITE; }}
            >
              <img
                src={hotel.mainImage || 'https://placehold.co/300x180?text=Hotel'}
                alt={hotel.name}
                style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.src = 'https://placehold.co/300x180?text=Hotel'; }}
              />
              <div style={{ padding: '16px 18px 18px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 500, color: TEXT, margin: '0 0 6px' }}>{hotel.name}</h3>
                <p style={{ fontSize: 12, color: MUTED, margin: '0 0 10px' }}>📍 {hotel.address}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13 }}>{'⭐'.repeat(hotel.starRating || 0)}</span>
                  <span style={{ fontSize: 12, color: CORAL, fontWeight: 500 }}>
                    {hotel.reviewScore ? `${hotel.reviewScore} (${hotel.reviewCount})` : 'No reviews'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
