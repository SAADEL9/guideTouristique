import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUnsplash from '../hooks/useUnsplash';

const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [query2, setQuery2] = useState('');
  const [imageQuery, setImageQuery] = useState('');
  const [country, setCountry] = useState(null);
  const [meteo, setmeteo] = useState(null);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  
  const { images, loading: imagesLoading, error: imagesError } = useUnsplash(imageQuery);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
      if (!response.ok) throw new Error('Country not found');
      const data = await response.json();
      setCountry(data[0]);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCountry(null);
    }
  };

  const handleSearch2 = async () => {
    if (!query2) return;
    setImageQuery(query2);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query2}&format=json`);
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();

      if (data.length === 0) throw new Error('City not found');

      const cityLat = data[0].lat;
      const cityLon = data[0].lon;

      const response2 = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${cityLat}&longitude=${cityLon}&current_weather=true`
      );
      const data2 = await response2.json();

      setmeteo(data2);
      setError(null);
    } catch (err) {
      setError(err.message);
      setmeteo(null);
    }
  };

  const styles = {
    hero: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0d1424 100%)`,
      color: '#e8eaf0',
      textAlign: 'center',
      padding: '120px 20px 80px',
      position: 'relative',
      overflow: 'hidden',
    },
    animatedBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at ${50 + scrollY * 0.02}% ${50 + scrollY * 0.01}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
      pointerEvents: 'none',
    },
    title: {
      fontSize: '64px',
      fontWeight: '800',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      position: 'relative',
      zIndex: 1,
      letterSpacing: '-1px',
    },
    subtitle: {
      fontSize: '20px',
      color: '#9ca3af',
      marginBottom: '50px',
      maxWidth: '600px',
      lineHeight: '1.6',
      position: 'relative',
      zIndex: 1,
    },
    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '600px',
      position: 'relative',
      zIndex: 1,
    },
    searchBox: {
      display: 'flex',
      gap: '10px',
      backgroundColor: 'rgba(22, 27, 34, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '15px',
      borderRadius: '16px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
    },
    primaryBtn: {
      backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: '#ffffff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      padding: '80px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#0a0e1a',
    },
    featureCard: {
      backgroundColor: 'rgba(22, 27, 34, 0.6)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '20px',
      border: '1px solid rgba(59, 130, 246, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    featureIcon: {
      fontSize: '48px',
      marginBottom: '20px',
    },
    featureTitle: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '10px',
      color: '#e8eaf0',
    },
    featureDesc: {
      fontSize: '14px',
      color: '#9ca3af',
      lineHeight: '1.6',
    },
    resultContainer: {
      marginTop: '30px',
      textAlign: 'left',
      backgroundColor: 'rgba(22, 27, 34, 0.9)',
      backdropFilter: 'blur(10px)',
      padding: '25px',
      borderRadius: '16px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: '600px',
    },
    resultTitle: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '15px',
      color: '#3b82f6',
    },
    resultItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    },
    resultLabel: {
      color: '#9ca3af',
      fontSize: '14px',
    },
    resultValue: {
      color: '#e8eaf0',
      fontSize: '14px',
      fontWeight: '600',
    },
    error: {
      color: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      padding: '12px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      position: 'relative',
      zIndex: 1,
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginTop: '20px',
      width: '100%',
    },
    imageCard: {
      borderRadius: '8px',
      overflow: 'hidden',
      height: '200px',
      backgroundColor: 'rgba(22, 27, 34, 0.6)',
    },
    imageElement: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    loadingText: {
      color: '#9ca3af',
      fontSize: '14px',
      marginTop: '15px',
    },
    ctaSection: {
      textAlign: 'center',
      padding: '80px 20px',
      backgroundColor: 'rgba(22, 27, 34, 0.4)',
    },
    ctaTitle: {
      fontSize: '36px',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#e8eaf0',
    },
    ctaButton: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      padding: '14px 32px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)',
      marginTop: '20px',
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.animatedBg}></div>
        <h1 style={styles.title}>Explore The World</h1>
        <p style={styles.subtitle}>
          Discover countries, check weather conditions, and find amazing hotels for your next adventure
        </p>

        <div style={styles.searchContainer}>
          {/* Country Search */}
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              type="text"
              placeholder="🌍 Search for a country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              style={styles.primaryBtn} 
              onClick={handleSearch}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
              }}
            >
              Search
            </button>
          </div>

          {/* Weather Search */}
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              type="text"
              placeholder="🌤️ Check weather in any city..."
              value={query2}
              onChange={(e) => setQuery2(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch2()}
            />
            <button 
              style={styles.primaryBtn} 
              onClick={handleSearch2}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
              }}
            >
              Check Weather
            </button>
          </div>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          {/* Country Result */}
          {country && (
            <div style={styles.resultContainer}>
              <h3 style={styles.resultTitle}>
                {country.name.common} {country.flag}
              </h3>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Capital</span>
                <span style={styles.resultValue}>{country.capital?.[0]}</span>
              </div>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Region</span>
                <span style={styles.resultValue}>{country.region}</span>
              </div>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Population</span>
                <span style={styles.resultValue}>{country.population.toLocaleString()}</span>
              </div>
              <div style={{ ...styles.resultItem, borderBottom: 'none' }}>
                <span style={styles.resultLabel}>Continent</span>
                <span style={styles.resultValue}>{country.continents?.[0]}</span>
              </div>
            </div>
          )}

          {/* Weather Result */}
          {meteo && (
            <div style={styles.resultContainer}>
              <h3 style={styles.resultTitle}>🌤️ Weather Forecast</h3>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Time</span>
                <span style={styles.resultValue}>{new Date(meteo.current_weather.time).toLocaleString()}</span>
              </div>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Temperature</span>
                <span style={styles.resultValue}>{meteo.current_weather.temperature}°C</span>
              </div>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Wind Speed</span>
                <span style={styles.resultValue}>{meteo.current_weather.windspeed} km/h</span>
              </div>
              <div style={{ ...styles.resultItem, borderBottom: 'none' }}>
                <span style={styles.resultLabel}>Wind Direction</span>
                <span style={styles.resultValue}>{meteo.current_weather.winddirection}°</span>
              </div>
            </div>
          )}

          {/* Images Result */}
          {imagesLoading && imageQuery && (
            <div style={styles.loadingText}>Loading images...</div>
          )}

          {imagesError && imageQuery && (
            <div style={styles.error}>⚠️ {imagesError}</div>
          )}

          {images && images.length > 0 && (
            <div style={styles.imageGrid}>
              {images.map((img) => (
                <div key={img.id} style={styles.imageCard}>
                  <img
                    src={img.urls.small}
                    alt={img.alt_description}
                    style={styles.imageElement}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.features}>
        <div 
          style={styles.featureCard}
          onClick={() => navigate('/hotels')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.featureIcon}>🏨</div>
          <h3 style={styles.featureTitle}>Find Hotels</h3>
          <p style={styles.featureDesc}>Discover amazing hotels in any city with our interactive map</p>
        </div>

        <div 
          style={styles.featureCard}
          onClick={() => navigate('/explore')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
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
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.featureIcon}>🌤️</div>
          <h3 style={styles.featureTitle}>Weather Info</h3>
          <p style={styles.featureDesc}>Get real-time weather data for any destination</p>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
        <p style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '30px' }}>
          Join thousands of travelers who trust Guide Touristique
        </p>
        <button 
          style={styles.ctaButton}
          onClick={() => navigate('/register')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.5)';
          }}
        >
          Get Started Free →
        </button>
      </div>
    </div>
  );
};

export default HomePage;
