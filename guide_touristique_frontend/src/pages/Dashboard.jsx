import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import { Tour, Hotel, Restaurant, Explore } from "@mui/icons-material";

const CORAL = '#FF6B35';
const CORAL_LIGHT = '#FFE8DF';
const CORAL_BG = '#FFF8F5';
const BORDER = '#EEEEEE';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const WHITE = '#FFFFFF';

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

  return (
    <Box sx={{ background: '#FAFAFA', minHeight: '100vh' }}>

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
        <Grid container spacing={2}>
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
      </Container>
    </Box>
  );
};

export default Dashboard;