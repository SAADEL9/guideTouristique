import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUnsplash from '../hooks/useUnsplash';
import useWikipedia from '../hooks/useWikipedia';
import { searchLocation } from '../api/locationService';
import { weatherClient } from '../api/externalClients';
import tourService from '../service/tourService';

const CORAL = '#FF6B35';
const BG = '#FAFAFA';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';
const NAV_OFFSET = 64;

const getWeatherIcon = (code) => {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌦️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '❄️';
  if (code <= 99) return '⛈️';
  return '🌡️';
};

const features = [
  { icon: '🎯', title: 'Guided Tours', desc: 'Book curated experiences and guided tours at top destinations', route: '/tours' },
  { icon: '🏨', title: 'Find Hotels', desc: 'Discover hotels in any city, filtered by your preferences', route: '/hotels' },
  { icon: '🍽️', title: 'Restaurants', desc: 'Search dining options for any city around the world', route: '/restaurants' },
  { icon: '🌤️', title: 'Live Weather', desc: 'Real-time forecasts for any destination on earth', route: null },
  { icon: '🗺️', title: 'Explore Places', desc: 'Find tourist spots and plan your perfect itinerary', route: '/restaurants' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [imageQuery, setImageQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [topRatedTours, setTopRatedTours] = useState([]);

  useEffect(() => {
    tourService.getTopRated().then(r => setTopRatedTours(r.data)).catch(() => {});
  }, []);

  const { images, loading: imagesLoading, error: imagesError } = useUnsplash(imageQuery);
  const { description, loading, getDescription } = useWikipedia();

  const hasSearched = Boolean(imageQuery.trim());

  const handleSearch = async () => {
    if (!query.trim()) return;
    setImageQuery(query.trim());
    setCurrentImageIndex(0);
    try {
      const location = await searchLocation(query.trim());
      const weatherRes = await weatherClient.get('/forecast', {
        params: {
          latitude: location.lat,
          longitude: location.lon,
          daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max',
          current_weather: true,
          timezone: 'auto',
          forecast_days: 7,
        },
      });
      getDescription(query.trim());
      setWeatherData(weatherRes.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  const galleryImages = images ? images.slice(0, 5) : [];
  const handlePrevImage = () => galleryImages.length && setCurrentImageIndex((p) => (p - 1 + galleryImages.length) % galleryImages.length);
  const handleNextImage = () => galleryImages.length && setCurrentImageIndex((p) => (p + 1) % galleryImages.length);

  const daily = weatherData?.daily;
  const current = weatherData?.current_weather;
  const forecastDays = daily?.time?.map((t, i) => ({
    time: t, max: daily.temperature_2m_max?.[i], min: daily.temperature_2m_min?.[i],
    code: daily.weathercode?.[i], rain: daily.precipitation_sum?.[i],
  })) ?? [];

  // ✅ renderSearchBar comme fonction normale, pas un composant
  const renderSearchBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 620, height: 52, background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: 999, paddingLeft: 20, paddingRight: 6, boxSizing: 'border-box' }}>
      <input
        style={{ flex: 1, border: 'none', background: 'transparent', color: TEXT, fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
        type="text"
        placeholder="Search for a city or country..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        type="button"
        onClick={handleSearch}
        style={{ background: CORAL, color: WHITE, borderRadius: 999, padding: '10px 24px', border: 'none', fontWeight: 500, fontSize: 14, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}
      >
        Explore
      </button>
    </div>
  );

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      {/* Hero */}
      {!hasSearched && (
        <div style={{ background: HERO_BG, minHeight: `calc(100vh - ${NAV_OFFSET}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px 80px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ACCENT_LIGHT, color: CORAL, borderRadius: 999, padding: '6px 14px', fontSize: 13, fontWeight: 500, marginBottom: 24 }}>
            <span>🌍</span> Discover the world
          </div>

          <h1 style={{ fontSize: 'clamp(38px, 7vw, 68px)', fontWeight: 500, color: TEXT, letterSpacing: '-1.5px', margin: '0 0 16px', lineHeight: 1.1, maxWidth: 720 }}>
            Your next adventure<br />
            <span style={{ color: CORAL }}>starts here</span>
          </h1>
          <p style={{ fontSize: 17, color: MUTED, margin: '0 0 36px', maxWidth: 480, lineHeight: 1.65, fontWeight: 400 }}>
            Explore destinations, check the weather, and book unforgettable tours — all in one place.
          </p>

          {renderSearchBar()}

          <div style={{ display: 'flex', gap: 40, marginTop: 52, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['200+', 'Tours Available'], ['50+', 'Cities'], ['1000+', 'Happy Travelers']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 500, color: TEXT }}>{num}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky search */}
      {hasSearched && (
        <div style={{ position: 'sticky', top: NAV_OFFSET, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: `0.5px solid ${BORDER}` }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center' }}>
            {renderSearchBar()}
          </div>
        </div>
      )}

      {/* Search results */}
      {hasSearched && (
        <div style={{ background: BG }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 56px' }}>
            {error && (
              <div style={{ color: '#b91c1c', background: '#fef2f2', border: '0.5px solid #fecaca', padding: '12px 16px', borderRadius: 12, marginBottom: 20 }}>
                ⚠️ {error}
              </div>
            )}

            {imagesLoading && <p style={{ color: MUTED, fontSize: 14 }}>Loading images...</p>}
            {imagesError && <div style={{ color: '#b91c1c', background: '#fef2f2', border: '0.5px solid #fecaca', padding: '12px 16px', borderRadius: 12, marginBottom: 20 }}>⚠️ {imagesError}</div>}

            {galleryImages.length > 0 && (
              <div>
                <img
                  src={galleryImages[currentImageIndex]?.urls?.regular || galleryImages[currentImageIndex]?.urls?.small}
                  alt={galleryImages[currentImageIndex]?.alt_description || 'Travel'}
                  style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 12, display: 'block', border: `0.5px solid ${BORDER}` }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 14 }}>
                  <button onClick={handlePrevImage} style={{ background: WHITE, border: `0.5px solid ${BORDER}`, color: TEXT, borderRadius: 999, padding: '8px 20px', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>← Prev</button>
                  <span style={{ color: MUTED, fontSize: 13 }}>{currentImageIndex + 1} / {galleryImages.length}</span>
                  <button onClick={handleNextImage} style={{ background: WHITE, border: `0.5px solid ${BORDER}`, color: TEXT, borderRadius: 999, padding: '8px 20px', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Next →</button>
                </div>
              </div>
            )}

            {loading && <p style={{ color: MUTED, fontSize: 14, marginTop: 24 }}>Loading description...</p>}
            {description && (
              <>
                <div style={{ borderLeft: `3px solid ${CORAL}`, paddingLeft: 12, fontSize: 17, fontWeight: 500, color: TEXT, margin: '36px 0 14px' }}>About {imageQuery}</div>
                <div style={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
                  <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.8, margin: 0 }}>{description.split('. ').slice(0, 3).join('. ')}</p>
                </div>
              </>
            )}

            {(current || forecastDays.length > 0) && (
              <>
                <div style={{ borderLeft: `3px solid ${CORAL}`, paddingLeft: 12, fontSize: 17, fontWeight: 500, color: TEXT, margin: '36px 0 14px' }}>Forecast</div>
                {current && (
                  <div style={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
                    <p style={{ fontSize: 52, fontWeight: 500, color: TEXT, lineHeight: 1, margin: 0 }}>
                      {current.temperature != null ? `${Math.round(current.temperature)}°` : '—'}
                    </p>
                    <p style={{ color: MUTED, margin: '12px 0 0', fontSize: 14 }}>
                      Wind {current.windspeed != null ? `${current.windspeed} km/h` : '—'}
                      {current.winddirection != null ? ` · ${current.winddirection}°` : ''}
                    </p>
                  </div>
                )}
                {forecastDays.length > 0 && (
                  <>
                    <p style={{ fontSize: 12, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '16px 0 10px' }}>7-day outlook</p>
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
                      {forecastDays.map((day, i) => (
                        <div key={`${day.time}-${i}`} style={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '16px 14px', minWidth: 100, textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ color: MUTED, fontSize: 11, fontWeight: 500 }}>
                            {new Date(day.time).toLocaleDateString(undefined, { weekday: 'short' })}
                          </div>
                          <div style={{ fontSize: 24, margin: '6px 0' }}>{getWeatherIcon(day.code ?? 0)}</div>
                          <div style={{ color: TEXT, fontWeight: 500, fontSize: 16 }}>{day.max != null ? `${Math.round(day.max)}°` : '—'}</div>
                          <div style={{ color: MUTED, fontSize: 12, marginTop: 2 }}>{day.min != null ? `${Math.round(day.min)}°` : '—'}</div>
                          <div style={{ color: CORAL, fontSize: 11, marginTop: 4 }}>{day.rain != null && day.rain > 0 ? `${day.rain}mm` : '0mm'}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Feature cards */}
      <div style={{ background: WHITE, borderTop: `0.5px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>Everything you need to travel</h2>
            <p style={{ color: MUTED, fontSize: 15 }}>Plan, explore, and book — without the complexity</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {features.map((f) => (
              <div
                key={f.title}
                onClick={() => f.route && navigate(f.route)}
                style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '28px 24px', cursor: f.route ? 'pointer' : 'default', transition: 'background 0.15s ease, border-color 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = HERO_BG; e.currentTarget.style.borderColor = '#FFD4C2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = BG; e.currentTarget.style.borderColor = BORDER; }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ color: TEXT, fontSize: 16, fontWeight: 500, margin: '0 0 6px' }}>{f.title}</h3>
                <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Rated Tours */}
      {topRatedTours.length > 0 && (
        <div style={{ background: BG, borderTop: `0.5px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ACCENT_LIGHT, color: CORAL, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 500, marginBottom: 10 }}>
                  ⭐ Top rated
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 500, color: TEXT, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Highest rated tours</h2>
                <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Loved by our travelers</p>
              </div>
              <button
                onClick={() => navigate('/rankings')}
                style={{ background: 'transparent', border: `0.5px solid ${BORDER}`, color: TEXT, borderRadius: 999, padding: '8px 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
              >
                See all rankings →
              </button>
            </div>

            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
              {topRatedTours.map((tour, idx) => (
                <div
                  key={tour.id}
                  onClick={() => navigate(`/tour/${tour.id}`)}
                  style={{ minWidth: 260, maxWidth: 260, background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, transition: 'border-color 0.15s ease, background 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD4C2'; e.currentTarget.style.background = HERO_BG; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = WHITE; }}
                >
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <img
                      src={tour.images?.[0] || 'https://via.placeholder.com/400x250?text=Tour'}
                      alt={tour.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Rank badge */}
                    <div style={{ position: 'absolute', top: 10, left: 10, background: CORAL, color: WHITE, borderRadius: 8, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>
                      #{idx + 1}
                    </div>
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', color: WHITE, borderRadius: 8, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}>
                      ${tour.price}
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 6, lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tour.title}
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      📍 {tour.meetingPoint || 'Multiple locations'}
                    </div>
                    {/* Star rating display */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} style={{ fontSize: 14, color: CORAL }}>★</span>
                      ))}
                      <span style={{ fontSize: 12, color: MUTED, marginLeft: 4 }}>{tour.duration} {tour.duration === 1 ? 'day' : 'days'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '72px 24px', background: HERO_BG, borderTop: `0.5px solid ${BORDER}` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ACCENT_LIGHT, color: CORAL, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 500, marginBottom: 20 }}>
          Get started today
        </div>
        <h2 style={{ color: TEXT, fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.5px' }}>
          Ready to start your journey?
        </h2>
        <p style={{ color: MUTED, fontSize: 15, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
          Join thousands of travelers who plan their trips with HiddenSpots.
        </p>
        <button
          type="button"
          onClick={() => navigate('/register')}
          style={{ background: CORAL, color: WHITE, borderRadius: 999, fontWeight: 500, border: 'none', padding: '12px 32px', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Create a free account →
        </button>
      </div>
    </div>
  );
};

export default HomePage;