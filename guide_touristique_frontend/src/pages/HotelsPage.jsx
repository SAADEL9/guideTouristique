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
            <p style={styles.titleSub}>Search by city and country code to browse stays.</p>

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

const accent = '#0284c7';
const border = '#e2e8f0';

const styles = {
    container: { padding: '32px 24px 48px', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a' },
    title: { textAlign: 'center', fontSize: 'clamp(28px, 4vw, 36px)', marginBottom: '8px', color: '#0f172a', fontWeight: 800 },
    titleSub: { textAlign: 'center', color: '#64748b', marginBottom: '28px', fontSize: '15px' },
    searchBar: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '36px', flexWrap: 'wrap' },
    input: { padding: '12px 18px', borderRadius: '999px', border: `1px solid ${border}`, backgroundColor: '#ffffff', color: '#0f172a', fontSize: '15px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' },
    btn: { padding: '12px 26px', backgroundColor: accent, color: '#fff', border: 'none', borderRadius: '999px', cursor: 'pointer', fontSize: '15px', fontWeight: 700, boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px', maxWidth: '1200px', margin: '0 auto' },
    card: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${border}`, transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)' },
    cardImg: { width: '100%', height: '200px', objectFit: 'cover' },
    cardBody: { padding: '18px' },
    hotelName: { fontSize: '17px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' },
    address: { fontSize: '13px', color: '#64748b', marginBottom: '10px' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    stars: { fontSize: '14px' },
    score: { fontSize: '13px', color: accent, fontWeight: '600' },
    msg: { textAlign: 'center', color: '#64748b' },
    error: { textAlign: 'center', color: '#dc2626', fontWeight: 600 },
};

export default HotelsPage;