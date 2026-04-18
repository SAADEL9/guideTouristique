import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLiteApi from '../hooks/useLiteApi';

const HotelsPage = () => {
    const [city, setCity] = useState('');
    const [countryCode, setCountryCode] = useState('MA');
    const { hotels, loading, error, search } = useLiteApi();
    const navigate = useNavigate();

    const handleSearch = () => {
        if (city) search(city, countryCode);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🏨 Find Hotels</h1>

            {/* Search Bar */}
            <div style={styles.searchBar}>
                <input
                    style={styles.input}
                    placeholder="City (e.g. Casablanca)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <input
                    style={{ ...styles.input, width: '80px' }}
                    placeholder="MA"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                    maxLength={2}
                />
                <button style={styles.btn} onClick={handleSearch}>Search</button>
            </div>

            {loading && <p style={styles.msg}>Loading hotels...</p>}
            {error && <p style={styles.error}>{error}</p>}

            {/* Hotel Cards */}
            <div style={styles.grid}>
                {hotels.map(hotel => (
                    <div
                        key={hotel.hotelId}
                        style={styles.card}
                        onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
                    >
                        <img
    src={hotel.mainImage || 'https://placehold.co/300x200?text=No+Image'}
    alt={hotel.name}
    style={styles.cardImg}
    onError={(e) => {
        e.target.src = 'https://placehold.co/300x200?text=No+Image';
    }}
/>
                        <div style={styles.cardBody}>
                            <h3 style={styles.hotelName}>{hotel.name}</h3>
                            <p style={styles.address}>📍 {hotel.address}</p>
                            <div style={styles.row}>
                                <span style={styles.stars}>
                                    {'⭐'.repeat(hotel.starRating || 0)}
                                </span>
                                <span style={styles.score}>
                                    {hotel.reviewScore
                                        ? `${hotel.reviewScore} (${hotel.reviewCount} reviews)`
                                        : 'No reviews'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', backgroundColor: '#0a0e1a', minHeight: '100vh', color: '#fff' },
    title: { textAlign: 'center', fontSize: '36px', marginBottom: '30px', color: '#3b82f6' },
    searchBar: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px' },
    input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #1e2a3a', backgroundColor: '#161b22', color: '#fff', fontSize: '16px' },
    btn: { padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' },
    card: { backgroundColor: '#161b22', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #1e2a3a', transition: 'transform 0.2s' },
    cardImg: { width: '100%', height: '200px', objectFit: 'cover' },
    cardBody: { padding: '16px' },
    hotelName: { fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#e8eaf0' },
    address: { fontSize: '13px', color: '#9ca3af', marginBottom: '10px' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    stars: { fontSize: '14px' },
    score: { fontSize: '13px', color: '#3b82f6', fontWeight: '600' },
    msg: { textAlign: 'center', color: '#9ca3af' },
    error: { textAlign: 'center', color: '#ef4444' },
};

export default HotelsPage;