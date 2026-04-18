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

const styles = {
    container: { backgroundColor: '#0a0e1a', minHeight: '100vh', color: '#fff' },
    heroImg: { width: '100%', height: '400px', objectFit: 'cover' },
    content: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    name: { fontSize: '32px', fontWeight: '800', color: '#e8eaf0' },
    stars: { fontSize: '20px' },
    address: { color: '#9ca3af', marginBottom: '20px' },
    reviewBox: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#161b22', padding: '16px', borderRadius: '12px', marginBottom: '30px' },
    score: { fontSize: '40px', fontWeight: '800', color: '#3b82f6' },
    reviewText: { color: '#9ca3af', fontSize: '16px' },
    section: { marginBottom: '40px' },
    sectionTitle: { fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: '#3b82f6', borderBottom: '1px solid #1e2a3a', paddingBottom: '8px' },
    desc: { color: '#9ca3af', lineHeight: '1.8', fontSize: '15px' },
    amenitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' },
    amenity: { backgroundColor: '#161b22', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', color: '#e8eaf0' },
    contact: { color: '#9ca3af', marginBottom: '8px' },
    link: { color: '#3b82f6' },
    gallery: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' },
    galleryImg: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' },
    mapWrapper: { height: '350px', borderRadius: '12px', overflow: 'hidden' },
    msg: { textAlign: 'center', color: '#9ca3af', padding: '40px' },
    error: { textAlign: 'center', color: '#ef4444', padding: '40px' },
};

export default HotelDetailPage;