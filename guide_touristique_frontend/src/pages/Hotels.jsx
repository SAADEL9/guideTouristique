import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLocationCoordinates } from '../api/locationService';
import { getHotels } from '../api/placesService';

// ─── Fix default marker icon bug ─────────────────────────────────────────────
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// ─── Blue icon for hotels ─────────────────────────────────────────────────────
const hotelIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const Hotels = () => {
    const [city, setCity] = useState('');
    const [hotels, setHotels] = useState([]);
    const [mapCenter, setMapCenter] = useState([33.59, -7.62]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const handleSearch = async () => {
        if (!city) return;
        setLoading(true);
        setError(null);
        setShowMap(false);

        try {
            // ─── Get city coordinates for map center ──────────────────────
            const coordinates = await getLocationCoordinates(city);
            setMapCenter([coordinates.lat, coordinates.lon]);

            // ─── Fetch hotels from your Spring Boot backend ───────────────
            const data = await getHotels(city);
            setHotels(data);

        } catch (err) {
            setError(err.message);
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            padding: '100px 40px 40px',
            backgroundColor: '#0a0e1a',
            minHeight: '100vh',
            color: '#fff'
        },
        header: {
            textAlign: 'center',
            marginBottom: '40px'
        },
        title: {
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        subtitle: {
            fontSize: '18px',
            color: '#9ca3af',
        },
        searchBar: {
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '40px'
        },
        inputWrapper: {
            position: 'relative',
            flex: '1',
            maxWidth: '500px'
        },
        input: {
            width: '100%',
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
        },
        searchButton: {
            padding: '16px 32px',
            backgroundColor: '#3b82f6',
            backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
        },
        mapToggleButton: {
            padding: '16px 32px',
            backgroundColor: showMap ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
            color: '#fff',
            border: showMap ? 'none' : '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: showMap ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        cardsGrid: {
            display: 'grid',
            gridTemplateColumns: showMap ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '25px',
            marginBottom: showMap ? '0' : '40px'
        },
        splitView: {
            display: 'flex',
            gap: '30px',
            height: 'calc(100vh - 280px)',
            minHeight: '600px'
        },
        cardsContainer: {
            flex: '0 0 450px',
            overflowY: 'auto',
            paddingRight: '15px',
            '&::-webkit-scrollbar': {
                width: '8px'
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(22, 27, 34, 0.5)',
                borderRadius: '10px'
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(59, 130, 246, 0.4)',
                borderRadius: '10px'
            }
        },
        mapContainer: {
            flex: 1,
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        },
        hotelCard: {
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            padding: '20px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        hotelImage: {
            width: '100%',
            height: '180px',
            borderRadius: '12px',
            objectFit: 'cover',
            marginBottom: '15px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        hotelName: {
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '10px',
            color: '#e8eaf0'
        },
        hotelAddress: {
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '15px',
            lineHeight: '1.5'
        },
        hotelDetails: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        hotelDetailRow: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            padding: '6px 0',
            borderBottom: '1px solid rgba(59, 130, 246, 0.1)'
        },
        label: {
            color: '#9ca3af'
        },
        value: {
            color: '#3b82f6',
            fontWeight: '600'
        },
        error: {
            color: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '15px 25px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto 30px'
        },
        loading: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9ca3af',
            fontSize: '18px'
        },
        emptyState: {
            textAlign: 'center',
            padding: '80px 20px',
            color: '#9ca3af'
        },
        emptyIcon: {
            fontSize: '80px',
            marginBottom: '20px'
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>🏨 Find Your Perfect Hotel</h1>
                <p style={styles.subtitle}>Search for hotels in any city and explore them on the map</p>
            </div>

            {/* Search Bar */}
            <div style={styles.searchBar}>
                <div style={styles.inputWrapper}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Enter city name..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                            e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                <button 
                    style={styles.searchButton} 
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
                    {loading ? 'Searching...' : '🔍 Search'}
                </button>
                {hotels.length > 0 && (
                    <button 
                        style={styles.mapToggleButton} 
                        onClick={() => setShowMap(!showMap)}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        {showMap ? '📋 Cards Only' : '🗺️ Show Map'}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && <div style={styles.error}>⚠️ {error}</div>}

            {/* Loading State */}
            {loading && <div style={styles.loading}>🔍 Searching for hotels...</div>}

            {/* Empty State */}
            {!loading && hotels.length === 0 && !error && (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🏨</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#e8eaf0' }}>No Hotels Yet</h3>
                    <p>Search for a city to discover amazing hotels</p>
                </div>
            )}

            {/* Hotels Display */}
            {!loading && hotels.length > 0 && (
                <>
                    {showMap ? (
                        /* Split View: Cards on Left, Map on Right */
                        <div style={styles.splitView}>
                            <div style={styles.cardsContainer}>
                                <div style={styles.cardsGrid}>
                                    {hotels.map((hotel, index) => (
                                        <div 
                                            key={index}
                                            style={styles.hotelCard}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={styles.hotelImage}>
                                                <div style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    fontSize: '48px'
                                                }}>
                                                    🏨
                                                </div>
                                            </div>
                                            <div style={styles.hotelName}>
                                                {hotel.name || 'Unnamed Hotel'}
                                            </div>
                                            <div style={styles.hotelAddress}>
                                                📍 {hotel.address || 'Address not available'}
                                            </div>
                                            {hotel.lat && hotel.lon && (
                                                <div style={styles.hotelDetails}>
                                                    <div style={styles.hotelDetailRow}>
                                                        <span style={styles.label}>Latitude</span>
                                                        <span style={styles.value}>{hotel.lat.toFixed(4)}</span>
                                                    </div>
                                                    <div style={styles.hotelDetailRow}>
                                                        <span style={styles.label}>Longitude</span>
                                                        <span style={styles.value}>{hotel.lon.toFixed(4)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={styles.mapContainer}>
                                <MapContainer
                                    center={mapCenter}
                                    zoom={13}
                                    style={{ height: '100%', width: '100%' }}
                                    key={mapCenter.toString()}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap contributors'
                                    />
                                    {hotels.map((hotel, index) => (
                                        hotel.lat && hotel.lon && (
                                            <Marker
                                                key={`map-${index}`}
                                                position={[hotel.lat, hotel.lon]}
                                                icon={hotelIcon}
                                            >
                                                <Popup>
                                                    <strong>{hotel.name || 'Unnamed Hotel'}</strong>
                                                    <br />
                                                    {hotel.address || 'No address available'}
                                                </Popup>
                                            </Marker>
                                        )
                                    ))}
                                </MapContainer>
                            </div>
                        </div>
                    ) : (
                        /* Cards Only View */
                        <div style={styles.cardsGrid}>
                            {hotels.map((hotel, index) => (
                                <div 
                                    key={index}
                                    style={styles.hotelCard}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={styles.hotelImage}>
                                        <div style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            fontSize: '48px'
                                        }}>
                                            🏨
                                        </div>
                                    </div>
                                    <div style={styles.hotelName}>
                                        {hotel.name || 'Unnamed Hotel'}
                                    </div>
                                    <div style={styles.hotelAddress}>
                                        📍 {hotel.address || 'Address not available'}
                                    </div>
                                    {hotel.lat && hotel.lon && (
                                        <div style={styles.hotelDetails}>
                                            <div style={styles.hotelDetailRow}>
                                                <span style={styles.label}>Latitude</span>
                                                <span style={styles.value}>{hotel.lat.toFixed(4)}</span>
                                            </div>
                                            <div style={styles.hotelDetailRow}>
                                                <span style={styles.label}>Longitude</span>
                                                <span style={styles.value}>{hotel.lon.toFixed(4)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Hotels;
