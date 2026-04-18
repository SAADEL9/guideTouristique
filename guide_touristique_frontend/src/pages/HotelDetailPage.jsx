import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useLiteApi from '../hooks/useLiteApi';

const HotelDetailPage = () => {
    const { hotelId } = useParams();
    const { hotelDetail, loading, error, getDetails } = useLiteApi();

    useEffect(() => {
        getDetails(hotelId);
    }, [hotelId]);

    useEffect(() => {
        if (hotelDetail) {
            console.log('Hotel detail received:', hotelDetail);
        }
    }, [hotelDetail]);

    if (loading) return <p style={styles.msg}>Loading...</p>;
    if (error) return <p style={styles.error}>{error}</p>;
    if (!hotelDetail) return null;

    const h = hotelDetail;

    return (
        <div style={styles.container}>

            {/* Hero Image */}
            {h.images?.[0] && (
                <img src={h.images[0]} alt={h.name} style={styles.heroImg} />
            )}

            <div style={styles.content}>

                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.name}>{h.name}</h1>
                    <span style={styles.stars}>{'⭐'.repeat(h.starRating || 0)}</span>
                </div>

                <p style={styles.address}>📍 {h.address}</p>

                {/* Review Score */}
                {h.reviewScore !== null && h.reviewScore !== undefined && (
                    <div style={styles.reviewBox}>
                        <span style={styles.score}>{h.reviewScore}</span>
                        <span style={styles.reviewText}>/ 10 — {h.reviewCount} reviews</span>
                    </div>
                )}

                {/* Description */}
                {h.description && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>About</h2>
                        <p style={styles.desc}>{h.description}</p>
                    </div>
                )}

                {/* Amenities */}
                {h.amenities?.length > 0 && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Amenities</h2>
                        <div style={styles.amenitiesGrid}>
                            {h.amenities.map((a, i) => (
                                <span key={i} style={styles.amenity}>✓ {a}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Contact</h2>
                    {h.phone && <p style={styles.contact}>📞 {h.phone}</p>}
                    {h.email && <p style={styles.contact}>✉️ {h.email}</p>}
                    {h.website && <p style={styles.contact}>🌐 <a href={h.website} style={styles.link} target="_blank">{h.website}</a></p>}
                </div>

                {/* Image Gallery */}
                {h.images?.length > 1 && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Photos</h2>
                        <div style={styles.gallery}>
                            {h.images.slice(1, 6).map((img, i) => (
                                <img key={i} src={img} alt={`hotel-${i}`} style={styles.galleryImg} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Map */}
                {h.lat !== null && h.lat !== undefined && h.lon !== null && h.lon !== undefined && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Location</h2>
                        <div style={styles.mapWrapper}>
                            <MapContainer center={[h.lat, h.lon]} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[h.lat, h.lon]}>
                                    <Popup>{h.name}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const accent = '#0284c7';
const border = '#e2e8f0';

const styles = {
    container: { backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a' },
    heroImg: { width: '100%', height: '400px', objectFit: 'cover', borderBottom: `1px solid ${border}` },
    content: { maxWidth: '900px', margin: '0 auto', padding: '36px 20px 48px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '12px' },
    name: { fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: '800', color: '#0f172a' },
    stars: { fontSize: '20px' },
    address: { color: '#64748b', marginBottom: '20px' },
    reviewBox: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', padding: '18px', borderRadius: '14px', marginBottom: '30px', border: `1px solid ${border}`, boxShadow: '0 2px 12px rgba(15,23,42,0.06)' },
    score: { fontSize: '40px', fontWeight: '800', color: accent },
    reviewText: { color: '#64748b', fontSize: '16px' },
    section: { marginBottom: '36px' },
    sectionTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '14px', color: accent, borderBottom: `1px solid ${border}`, paddingBottom: '8px' },
    desc: { color: '#475569', lineHeight: '1.8', fontSize: '15px' },
    amenitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' },
    amenity: { backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#0f172a', border: `1px solid ${border}` },
    contact: { color: '#475569', marginBottom: '8px' },
    link: { color: accent, fontWeight: 600 },
    gallery: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' },
    galleryImg: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${border}` },
    mapWrapper: { height: '350px', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${border}`, boxShadow: '0 4px 24px rgba(15,23,42,0.08)' },
    msg: { textAlign: 'center', color: '#64748b', padding: '40px' },
    error: { textAlign: 'center', color: '#dc2626', padding: '40px', fontWeight: 600 },
};

export default HotelDetailPage;