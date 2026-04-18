import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUnsplash from '../hooks/useUnsplash';
import useWikipedia from '../hooks/useWikipedia';
import { searchLocation } from '../api/locationService';
import { weatherClient } from '../api/externalClients';

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

const NAV_OFFSET = 70;

const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [imageQuery, setImageQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          daily:
            'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max',
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

  const handlePrevImage = () => {
    if (galleryImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    if (galleryImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const palette = {
    bg: '#f8fafc',
    surface: '#ffffff',
    accent: '#0284c7',
    text: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    rain: '#0369a1',
  };

  const searchBarStyle = {
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
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  };

  const searchInputStyle = {
    flex: 1,
    minWidth: 0,
    height: '100%',
    border: 'none',
    background: 'transparent',
    color: palette.text,
    fontSize: '17px',
    outline: 'none',
  };

  const searchBtnStyle = {
    background: palette.accent,
    color: '#ffffff',
    borderRadius: '999px',
    padding: '11px 28px',
    border: 'none',
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
    flexShrink: 0,
  };

  const styles = {
    page: {
      background: palette.bg,
      minHeight: '100vh',
    },
    hero: {
      minHeight: `calc(100vh - ${NAV_OFFSET}px)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '48px 24px 64px',
      background: `linear-gradient(180deg, #ffffff 0%, ${palette.bg} 100%)`,
    },
    heroTitle: {
      fontSize: 'clamp(40px, 8vw, 72px)',
      fontWeight: 900,
      color: palette.text,
      letterSpacing: '-2px',
      margin: '0 0 16px',
      lineHeight: 1.05,
    },
    heroSubtitle: {
      fontSize: '19px',
      color: palette.muted,
      margin: '0 0 36px',
      maxWidth: '520px',
      lineHeight: 1.6,
    },
    searchOuter: {
      width: '100%',
      maxWidth: '700px',
    },
    stickySearchWrap: {
      position: 'sticky',
      top: NAV_OFFSET,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${palette.border}`,
      boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
    },
    stickyInner: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '16px 20px',
    },
    resultsWrap: {
      background: palette.bg,
      color: palette.text,
    },
    resultsInner: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '32px 20px 48px',
    },
    galleryImg: {
      width: '100%',
      height: '450px',
      objectFit: 'cover',
      borderRadius: '16px',
      display: 'block',
      border: `1px solid ${palette.border}`,
      boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
    },
    galleryNav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      marginTop: '18px',
      flexWrap: 'wrap',
    },
    pillNavBtn: {
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      color: palette.text,
      borderRadius: '999px',
      padding: '10px 26px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 600,
    },
    imageCounter: {
      color: palette.muted,
      fontSize: '14px',
      minWidth: '56px',
      textAlign: 'center',
    },
    sectionTitleBar: {
      borderLeft: `4px solid ${palette.accent}`,
      paddingLeft: '12px',
      fontSize: '20px',
      fontWeight: 700,
      color: palette.text,
      margin: '40px 0 16px',
    },
    forecastRow: {
      display: 'flex',
      gap: '12px',
      overflowX: 'auto',
      paddingBottom: '8px',
      WebkitOverflowScrolling: 'touch',
    },
    forecastCard: {
      background: palette.surface,
      borderRadius: '14px',
      padding: '18px',
      minWidth: '110px',
      textAlign: 'center',
      flexShrink: 0,
      border: `1px solid ${palette.border}`,
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
    },
    currentWeatherCard: {
      background: palette.surface,
      borderRadius: '16px',
      padding: '28px',
      marginTop: '8px',
      border: `1px solid ${palette.border}`,
      boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
    },
    bigTemp: {
      fontSize: '56px',
      fontWeight: 900,
      color: palette.text,
      margin: 0,
      lineHeight: 1,
    },
    descText: {
      color: palette.muted,
      fontSize: '16px',
      lineHeight: 1.85,
      margin: 0,
    },
    descCard: {
      background: palette.surface,
      borderRadius: '16px',
      padding: '28px',
      border: `1px solid ${palette.border}`,
      boxShadow: '0 2px 12px rgba(15, 23, 42, 0.05)',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      padding: '72px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: palette.surface,
      borderTop: `1px solid ${palette.border}`,
      boxSizing: 'border-box',
    },
    featureCard: {
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: '16px',
      padding: '32px',
      cursor: 'pointer',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    featureIcon: {
      fontSize: '36px',
      marginBottom: '14px',
    },
    featureTitle: {
      color: palette.text,
      fontSize: '18px',
      fontWeight: 700,
      margin: '0 0 8px',
    },
    featureDesc: {
      color: palette.muted,
      fontSize: '14px',
      lineHeight: 1.6,
      margin: 0,
    },
    ctaSection: {
      textAlign: 'center',
      padding: '72px 24px',
      background: `linear-gradient(135deg, ${palette.accent} 0%, #0369a1 100%)`,
    },
    ctaTitle: {
      color: '#ffffff',
      fontSize: 'clamp(28px, 5vw, 40px)',
      fontWeight: 900,
      margin: '0 0 24px',
    },
    ctaButton: {
      background: '#ffffff',
      color: palette.accent,
      borderRadius: '999px',
      fontWeight: 800,
      border: 'none',
      padding: '14px 32px',
      fontSize: '16px',
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
    errorBox: {
      color: '#b91c1c',
      background: '#fef2f2',
      border: `1px solid #fecaca`,
      padding: '14px 18px',
      borderRadius: '12px',
      marginBottom: '20px',
    },
    loadingText: {
      color: palette.muted,
      fontSize: '15px',
    },
  };

  const daily = weatherData?.daily;
  const current = weatherData?.current_weather;
  const forecastDays =
    daily?.time?.map((t, i) => ({
      time: t,
      max: daily.temperature_2m_max?.[i],
      min: daily.temperature_2m_min?.[i],
      code: daily.weathercode?.[i],
      rain: daily.precipitation_sum?.[i],
    })) ?? [];

  const renderSearchBar = () => (
    <div style={styles.searchOuter}>
      <div style={searchBarStyle}>
        <input
          style={searchInputStyle}
          type="text"
          placeholder="Search for a city or country..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button type="button" style={searchBtnStyle} onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {!hasSearched && (
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Explore The World</h1>
          <p style={styles.heroSubtitle}>
            Discover countries, check weather conditions, and find amazing hotels for your next
            adventure
          </p>
          {renderSearchBar()}
        </div>
      )}

      {hasSearched && (
        <div style={styles.stickySearchWrap}>
          <div style={styles.stickyInner}>{renderSearchBar()}</div>
        </div>
      )}

      {hasSearched && (
        <div style={styles.resultsWrap}>
          <div style={styles.resultsInner}>
            {error && <div style={styles.errorBox}>⚠️ {error}</div>}

            {imagesLoading && imageQuery && (
              <p style={styles.loadingText}>Loading images...</p>
            )}
            {imagesError && imageQuery && <div style={styles.errorBox}>⚠️ {imagesError}</div>}

            {galleryImages.length > 0 && (
              <div>
                <img
                  src={
                    galleryImages[currentImageIndex]?.urls?.regular ||
                    galleryImages[currentImageIndex]?.urls?.small
                  }
                  alt={galleryImages[currentImageIndex]?.alt_description || 'Travel'}
                  style={styles.galleryImg}
                />
                <div style={styles.galleryNav}>
                  <button type="button" style={styles.pillNavBtn} onClick={handlePrevImage}>
                    ← Previous
                  </button>
                  <span style={styles.imageCounter}>
                    {galleryImages.length > 0
                      ? `${currentImageIndex + 1} / ${galleryImages.length}`
                      : ''}
                  </span>
                  <button type="button" style={styles.pillNavBtn} onClick={handleNextImage}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <p style={{ ...styles.loadingText, marginTop: '24px' }}>Loading description...</p>
            )}
            {description && (
              <>
                <h2 style={styles.sectionTitleBar}>About {imageQuery}</h2>
                <div style={styles.descCard}>
                  <p style={styles.descText}>{description.split('. ').slice(0, 3).join('. ')}</p>
                </div>
              </>
            )}

            {(current || forecastDays.length > 0) && (
              <>
                <h2 style={styles.sectionTitleBar}>Forecast</h2>
                {current && (
                  <div style={styles.currentWeatherCard}>
                    <p style={styles.bigTemp}>
                      {current.temperature != null ? `${Math.round(current.temperature)}°` : '—'}
                    </p>
                    <p style={{ color: palette.muted, margin: '14px 0 0', fontSize: '15px' }}>
                      Wind {current.windspeed != null ? `${current.windspeed} km/h` : '—'}
                      {current.winddirection != null ? ` · ${current.winddirection}°` : ''}
                    </p>
                  </div>
                )}
                {forecastDays.length > 0 && (
                  <>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: palette.muted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        margin: '20px 0 12px',
                      }}
                    >
                      7-day outlook
                    </p>
                    <div style={styles.forecastRow}>
                      {forecastDays.map((day, idx) => (
                        <div key={`${day.time}-${idx}`} style={styles.forecastCard}>
                          <div style={{ color: palette.muted, fontSize: '12px', fontWeight: 600 }}>
                            {new Date(day.time).toLocaleDateString(undefined, { weekday: 'short' })}
                          </div>
                          <div style={{ fontSize: '26px', margin: '8px 0' }}>
                            {getWeatherIcon(day.code ?? 0)}
                          </div>
                          <div style={{ color: palette.text, fontWeight: 700, fontSize: '17px' }}>
                            {day.max != null ? `${Math.round(day.max)}°` : '—'}
                          </div>
                          <div style={{ color: palette.muted, fontSize: '13px', marginTop: '2px' }}>
                            {day.min != null ? `${Math.round(day.min)}°` : '—'}
                          </div>
                          <div style={{ color: palette.rain, fontSize: '11px', marginTop: '6px' }}>
                            {day.rain != null && day.rain > 0 ? `${day.rain} mm` : '0 mm'}
                          </div>
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

      <div style={styles.features}>
        <div
          style={styles.featureCard}
          onClick={() => navigate('/hotels')}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = palette.accent;
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(2, 132, 199, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = palette.border;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.featureIcon}>🏨</div>
          <h3 style={styles.featureTitle}>Find Hotels</h3>
          <p style={styles.featureDesc}>
            Discover amazing hotels in any city with our interactive map
          </p>
        </div>

        <div
          style={styles.featureCard}
          onClick={() => navigate('/explore')}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = palette.accent;
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(2, 132, 199, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = palette.border;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.featureIcon}>🗺️</div>
          <h3 style={styles.featureTitle}>Explore Places</h3>
          <p style={styles.featureDesc}>Explore tourist attractions and plan your perfect trip</p>
        </div>

        <div
          style={styles.featureCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = palette.accent;
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(2, 132, 199, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = palette.border;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.featureIcon}>🌤️</div>
          <h3 style={styles.featureTitle}>Weather Info</h3>
          <p style={styles.featureDesc}>Get real-time weather data for any destination</p>
        </div>

        <div
          style={styles.featureCard}
          onClick={() => navigate('/restaurants')}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = palette.accent;
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(2, 132, 199, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = palette.border;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.featureIcon}>🍽️</div>
          <h3 style={styles.featureTitle}>Find Restaurants</h3>
          <p style={styles.featureDesc}>Search dining options by city for your next meal</p>
        </div>
      </div>

      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
        <button type="button" style={styles.ctaButton} onClick={() => navigate('/register')}>
          Get Started Free →
        </button>
      </div>
    </div>
  );
};

export default HomePage;
