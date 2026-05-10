import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid, CircularProgress } from "@mui/material";
import { Tour, Hotel, Restaurant, Explore, Favorite, LocationOn, AccessTime } from "@mui/icons-material";
import userService from '../service/userService';

const CORAL = '#FF6B35';
const CORAL_LIGHT = '#FFE8DF';
const CORAL_BG = '#FFF8F5';
const BORDER = '#EEEEEE';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const WHITE = '#FFFFFF';
const BG = '#FAFAFA';

const features = [
  {
    title: 'Explore Tours',
    description: 'Browse and book amazing guided tours at top destinations worldwide.',
    icon: <Tour sx={{ fontSize: 28, color: CORAL }} />,
    route: '/tours',
    buttonText: 'Browse Tours',
  },
  {
    title: 'Find Hotels',
    description: 'Discover amazing hotels in any city with our interactive map.',
    icon: <Hotel sx={{ fontSize: 28, color: CORAL }} />,
    route: '/hotels',
    buttonText: 'Find Hotels',
  },
  {
    title: 'Restaurants',
    description: 'Search dining options by city for your next meal.',
    icon: <Restaurant sx={{ fontSize: 28, color: CORAL }} />,
    route: '/restaurants',
    buttonText: 'Find Restaurants',
  },
  {
    title: 'Explore Places',
    description: 'Search for destinations and get real-time weather information.',
    icon: <Explore sx={{ fontSize: 28, color: CORAL }} />,
    route: '/',
    buttonText: 'Start Exploring',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(true);

  useEffect(() => {
    userService.getFavorites()
      .then(r => setFavorites(r.data || []))
      .catch(() => setFavorites([]))
      .finally(() => setFavLoading(false));
  }, []);

  const removeFavorite = async (tourId) => {
    try {
      await userService.removeFavorite(tourId);
      setFavorites(prev => prev.filter(t => t.id !== tourId));
    } catch (e) {}
  };

  return (
    <Box sx={{ background: BG, minHeight: '100vh' }}>

      {/* Coral Header */}
      <Box sx={{ background: CORAL, px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
          <Explore sx={{ fontSize: 22, color: WHITE }} />
        </Box>
        <Typography sx={{ fontSize: 16, fontWeight: 500, color: WHITE }}>My dashboard</Typography>
        <Box sx={{ width: '1px', height: 16, background: 'rgba(255,255,255,0.3)', mx: 1 }} />
        <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Your travel hub</Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* Welcome */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 500, color: TEXT, mb: 0.5 }}>
            Welcome back 👋
          </Typography>
          <Typography sx={{ fontSize: 14, color: MUTED }}>
            Discover your next adventure — tours, hotels, restaurants and more.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={2} sx={{ mb: 5 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} key={feature.title}>
              <Box sx={{
                background: WHITE,
                border: `0.5px solid ${BORDER}`,
                borderRadius: '12px',
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background 0.2s',
                '&:hover': { borderColor: CORAL, background: CORAL_BG },
              }}
                onClick={() => navigate(feature.route)}
              >
                <Box sx={{ p: 1.5, background: CORAL_LIGHT, borderRadius: '10px', display: 'inline-flex', mb: 2, alignSelf: 'flex-start' }}>
                  {feature.icon}
                </Box>
                <Typography sx={{ fontSize: 15, fontWeight: 500, color: TEXT, mb: 0.75 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.6, mb: 2.5, flex: 1 }}>
                  {feature.description}
                </Typography>
                <Button
                  onClick={(e) => { e.stopPropagation(); navigate(feature.route); }}
                  sx={{
                    background: CORAL, color: WHITE, borderRadius: '20px',
                    px: 2.5, py: 0.75, fontSize: 13, fontWeight: 500,
                    textTransform: 'none', alignSelf: 'flex-start',
                    '&:hover': { background: '#e55a25' }
                  }}
                >
                  {feature.buttonText}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Favorites Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Favorite sx={{ fontSize: 18, color: CORAL }} />
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: TEXT }}>My Favorites</Typography>
            {!favLoading && favorites.length > 0 && (
              <Box sx={{ background: CORAL_LIGHT, color: CORAL, borderRadius: 999, px: 1, py: 0.2, fontSize: 12, fontWeight: 500, ml: 0.5 }}>
                {favorites.length}
              </Box>
            )}
          </Box>
          <Typography sx={{ fontSize: 13, color: MUTED, mb: 2.5 }}>Tours you've saved for later</Typography>

          {favLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} thickness={3} sx={{ color: CORAL }} />
            </Box>
          ) : favorites.length === 0 ? (
            <Box sx={{
              background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '12px',
              p: 4, textAlign: 'center',
            }}>
              <Typography sx={{ fontSize: 32, mb: 1.5 }}>🤍</Typography>
              <Typography sx={{ color: TEXT, fontWeight: 500, mb: 0.5 }}>No favorites yet</Typography>
              <Typography sx={{ color: MUTED, fontSize: 13, mb: 2.5 }}>
                Save tours by tapping the heart on any tour page.
              </Typography>
              <Button
                onClick={() => navigate('/tours')}
                sx={{ borderRadius: '20px', background: CORAL, color: WHITE, fontSize: 13, fontWeight: 500, px: 3, '&:hover': { background: '#E85A25' } }}
              >
                Browse tours
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {favorites.map((tour) => (
                <Grid item xs={12} sm={6} md={4} key={tour.id}>
                  <Box sx={{
                    background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '12px',
                    overflow: 'hidden', cursor: 'pointer',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    '&:hover': { borderColor: '#FFD4C2', background: CORAL_BG },
                  }}
                    onClick={() => navigate(`/tour/${tour.id}`)}
                  >
                    <Box sx={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                      <img
                        src={tour.images?.[0] || 'https://via.placeholder.com/400x250?text=Tour'}
                        alt={tour.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Box sx={{ position: 'absolute', top: 8, right: 8, background: CORAL, color: WHITE, borderRadius: '8px', px: 1, py: 0.3, fontSize: 12, fontWeight: 500 }}>
                        ${tour.price}
                      </Box>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: TEXT, mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tour.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                        <LocationOn sx={{ fontSize: 12, color: MUTED }} />
                        <Typography sx={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tour.meetingPoint || 'Multiple locations'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 12, color: MUTED }} />
                          <Typography sx={{ fontSize: 12, color: MUTED }}>{tour.duration} {tour.duration === 1 ? 'day' : 'days'}</Typography>
                        </Box>
                        <Button
                          size="small"
                          onClick={(e) => { e.stopPropagation(); removeFavorite(tour.id); }}
                          sx={{ fontSize: 11, color: MUTED, textTransform: 'none', p: 0, minWidth: 'auto', '&:hover': { color: CORAL } }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
