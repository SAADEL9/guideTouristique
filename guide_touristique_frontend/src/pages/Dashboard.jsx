import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from "@mui/material";
import { Tour, Hotel, Restaurant, Explore } from "@mui/icons-material";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Explore Tours',
      description: 'Browse and book amazing guided tours in your destination',
      icon: <Tour sx={{ fontSize: 50, color: '#38bdf8' }} />, 
      action: () => navigate('/tours'),
      buttonText: 'Browse Tours',
      gradient: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,58,138,0.8) 100%)',
      glow: 'rgba(56, 189, 248, 0.4)'
    },
    {
      title: 'Find Hotels',
      description: 'Discover amazing hotels in any city with our interactive map',
      icon: <Hotel sx={{ fontSize: 50, color: '#f472b6' }} />,
      action: () => navigate('/hotels'),
      buttonText: 'Find Hotels',
      gradient: 'linear-gradient(135deg, rgba(131,24,67,0.8) 0%, rgba(190,24,93,0.8) 100%)',
      glow: 'rgba(244, 114, 182, 0.4)'
    },
    {
      title: 'Discover Restaurants',
      description: 'Search dining options by city for your next meal',
      icon: <Restaurant sx={{ fontSize: 50, color: '#34d399' }} />, 
      action: () => navigate('/restaurants'),
      buttonText: 'Find Restaurants',
      gradient: 'linear-gradient(135deg, rgba(6,78,59,0.8) 0%, rgba(4,120,87,0.8) 100%)',
      glow: 'rgba(52, 211, 153, 0.4)'
    },
    {
      title: 'Explore Places',
      description: 'Search for destinations and get weather information',
      icon: <Explore sx={{ fontSize: 50, color: '#fbbf24' }} />, 
      action: () => navigate('/'),
      buttonText: 'Start Exploring',
      gradient: 'linear-gradient(135deg, rgba(120,53,15,0.8) 0%, rgba(180,83,9,0.8) 100%)',
      glow: 'rgba(251, 191, 36, 0.4)'
    }
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
      minHeight: '100vh', 
      pb: 12,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Premium Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        py: { xs: 10, md: 14 },
        px: 2,
        textAlign: 'center',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.5)',
        mb: 10,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated decorative shapes */}
        <Box sx={{ 
          position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', 
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(0,0,0,0) 70%)',
          animation: 'pulse 8s infinite alternate'
        }} />
        <Box sx={{ 
          position: 'absolute', bottom: '-20%', right: '-5%', width: '500px', height: '500px', 
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, rgba(0,0,0,0) 70%)',
          animation: 'pulse 10s infinite alternate-reverse'
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            fontWeight: 900, 
            letterSpacing: '-1.5px', 
            textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            mb: 3
          }}>
            Welcome to Your Dashboard
          </Typography>
          <Typography variant="h6" sx={{ 
            maxWidth: 750, 
            mx: 'auto', 
            fontWeight: 400, 
            color: '#cbd5e1', 
            lineHeight: 1.8,
            fontSize: '1.15rem'
          }}>
            Your personal gateway to the world. Discover amazing destinations, book exclusive tours, find luxury hotels, and explore top-rated restaurants globally.
          </Typography>
        </Container>

        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1) translate(0, 0); }
              100% { transform: scale(1.1) translate(20px, -20px); }
            }
          `}
        </style>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '24px',
                  background: feature.gradient,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: 'white',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: `0 20px 40px ${feature.glow}`,
                    borderColor: 'rgba(255,255,255,0.3)',
                    '& .icon-container': {
                      transform: 'scale(1.15) rotate(5deg)'
                    },
                    '& .bg-shape': {
                      transform: 'scale(1.2)',
                      opacity: 0.8
                    }
                  },
                }}
              >
                {/* Decorative background shape */}
                <Box className="bg-shape" sx={{ 
                  position: 'absolute', top: -40, right: -40, width: 200, height: 200, 
                  borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                  transition: 'all 0.6s ease'
                }} />

                <CardContent sx={{ flexGrow: 1, p: 5, position: 'relative', zIndex: 1 }}>
                  <Box className="icon-container" sx={{ 
                    mb: 4, 
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.5px' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 400 }}>
                    {feature.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 5, pt: 0, position: 'relative', zIndex: 1 }}>
                  <Button
                    variant="contained"
                    onClick={feature.action}
                    size="large"
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.25)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
