import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Button
} from "@mui/material";
import { Search, LocationOn, AccessTime } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';

const ToursList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [filteredTours, setFilteredTours] = useState([]);

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    filterTours();
  }, [tours, searchQuery, priceFilter, durationFilter]);

  const fetchTours = async () => {
    try {
      const response = await axiosInstance.get('/tours');
      setTours(response.data);
    } catch (err) {
      setError('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const filterTours = () => {
    let filtered = tours;

    if (searchQuery) {
      filtered = filtered.filter(tour =>
        (tour.meetingPoint && tour.meetingPoint.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tour.title && tour.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(tour => {
        if (max) return tour.price >= min && tour.price <= max;
        return tour.price >= min;
      });
    }

    if (durationFilter) {
      filtered = filtered.filter(tour => tour.duration === parseInt(durationFilter, 10));
    }

    setFilteredTours(filtered);
  };

  const handleTourClick = (tourId) => {
    navigate(`/tour/${tourId}`);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', pb: 8 }}>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: 'center',
        borderBottomLeftRadius: '50px',
        borderBottomRightRadius: '50px',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
        mb: 6
      }}>
        <Typography variant="h2" fontWeight="800" sx={{ mb: 2, letterSpacing: '-1px' }}>
          Explore The World
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto', fontWeight: 300 }}>
          Discover breathtaking tours carefully crafted to give you the experience of a lifetime.
        </Typography>
      </Box>

      <Container maxWidth="xl">
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Glassmorphism Filters */}
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          p: 3,
          mb: 6,
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        }}>
          <TextField
            label="Search destination or tour..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' }, '& .MuiOutlinedInput-root': { borderRadius: 3, background: 'rgba(255,255,255,0.8)' } }}
            InputProps={{
              endAdornment: <Search color="action" />
            }}
          />

          <FormControl sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: 3, background: 'rgba(255,255,255,0.8)' } }}>
            <InputLabel>Price Range</InputLabel>
            <Select value={priceFilter} label="Price Range" onChange={(e) => setPriceFilter(e.target.value)}>
              <MenuItem value="">All Budgets</MenuItem>
              <MenuItem value="0-100">Under $100</MenuItem>
              <MenuItem value="101-200">$100 - $200</MenuItem>
              <MenuItem value="201-500">$200 - $500</MenuItem>
              <MenuItem value="501">Luxury ($500+)</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: 3, background: 'rgba(255,255,255,0.8)' } }}>
            <InputLabel>Duration</InputLabel>
            <Select value={durationFilter} label="Duration" onChange={(e) => setDurationFilter(e.target.value)}>
              <MenuItem value="">Any Duration</MenuItem>
              <MenuItem value="1">1 Day</MenuItem>
              <MenuItem value="2">2 Days</MenuItem>
              <MenuItem value="3">3 Days</MenuItem>
              <MenuItem value="7">1 Week</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tours Grid */}
        <Grid container spacing={4}>
          {filteredTours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tour.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                    '& .tour-image': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden', paddingTop: '65%' }}>
                  <CardMedia
                    className="tour-image"
                    component="img"
                    image={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={tour.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <Box sx={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    px: 1.5, py: 0.5, borderRadius: 2,
                    fontWeight: 700, color: '#1e3a8a'
                  }}>
                    ${tour.price}
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Typography variant="h6" component="h2" fontWeight="700" gutterBottom sx={{ lineHeight: 1.2 }}>
                    {tour.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 2, gap: 1 }}>
                    <LocationOn fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight="500">
                      {tour.meetingPoint || 'Multiple Locations'}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{
                    mb: 3, flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {tour.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2" fontWeight="600">{tour.duration} Days</Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleTourClick(tour.id)}
                    sx={{
                      borderRadius: 3,
                      py: 1.2,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      }
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredTours.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', mt: 8, p: 6, background: 'rgba(255,255,255,0.5)', borderRadius: 4 }}>
            <Typography variant="h5" color="text.secondary" fontWeight="600">
              No tours found matching your criteria.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search filters or browse all tours.
            </Typography>
            <Button variant="outlined" onClick={() => { setSearchQuery(''); setPriceFilter(''); setDurationFilter(''); }} sx={{ mt: 3, borderRadius: 3 }}>
              Clear Filters
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ToursList;