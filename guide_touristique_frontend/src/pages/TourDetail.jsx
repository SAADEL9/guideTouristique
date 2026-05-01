import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  IconButton
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  CheckCircle,
  Cancel,
  Language,
  EventAvailable,
  ArrowBackIosNew,
  ArrowForwardIos
} from "@mui/icons-material";

import BookingDialog from '../components/BookingDialog';
import ReviewsList from '../components/Reviews/ReviewsList';
import AddReviewForm from '../components/Reviews/AddReviewForm';
import QASection from '../components/QA/QASection';
import axiosInstance from '../api/AxiosInstance';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await axiosInstance.get(`/tours/${id}`);
      setTour(response.data);
    } catch (err) {
      setError('Failed to load tour details');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (tour?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
    }
  };

  const prevImage = () => {
    if (tour?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  if (error || !tour) {
    return (
      <Container sx={{ mt: 10, minHeight: '80vh' }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{error || 'Tour not found'}</Alert>
      </Container>
    );
  }

  const images = tour.images && tour.images.length > 0 ? tour.images : ['https://via.placeholder.com/1200x600?text=No+Image'];

  return (
    <Box sx={{ background: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      {/* Full-width Hero Image Slider */}
      <Box sx={{ position: 'relative', height: { xs: '400px', md: '600px' }, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={images[currentImageIndex]}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Gradient Overlay */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)'
        }} />
        
        {images.length > 1 && (
          <>
            <IconButton onClick={prevImage} sx={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', '&:hover': { background: 'rgba(255,255,255,0.4)' } }}>
              <ArrowBackIosNew />
            </IconButton>
            <IconButton onClick={nextImage} sx={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', '&:hover': { background: 'rgba(255,255,255,0.4)' } }}>
              <ArrowForwardIos />
            </IconButton>
          </>
        )}

        <Container maxWidth="lg" sx={{ position: 'absolute', bottom: 40, left: 0, right: 0, color: 'white' }}>
          <Typography variant="h2" fontWeight="800" sx={{ mb: 1, textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {tour.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', opacity: 0.9 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn />
              <Typography variant="h6">{tour.meetingPoint || 'N/A'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime />
              <Typography variant="h6">{tour.duration} Days</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={4}>
          
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', mb: 4 }}>
              <Typography variant="h5" fontWeight="700" gutterBottom color="primary.main">
                About This Tour
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.1rem', mb: 4 }}>
                {tour.description}
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h5" fontWeight="700" gutterBottom>
                Tour Highlights
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {tour.activities && tour.activities.map((activity, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, background: '#f1f5f9', borderRadius: 3 }}>
                      <CheckCircle color="primary" />
                      <Typography fontWeight="500">{activity}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EventAvailable color="secondary" />
                    <Typography variant="h6" fontWeight="600">Available Dates</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tour.availableDates && tour.availableDates.map((date) => (
                      <Chip key={date} label={date} sx={{ borderRadius: 2, background: '#e0e7ff', color: '#3730a3', fontWeight: 600 }} />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Language color="info" />
                    <Typography variant="h6" fontWeight="600">Languages</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tour.languages && tour.languages.map((lang) => (
                      <Chip key={lang} label={lang} variant="outlined" color="info" sx={{ borderRadius: 2, fontWeight: 600 }} />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="600" gutterBottom color="success.main">
                    Included
                  </Typography>
                  <List>
                    {tour.included && tour.included.map((item, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="600" gutterBottom color="error.main">
                    Not Included
                  </Typography>
                  <List>
                    {tour.notIncluded && tour.notIncluded.map((item, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}><Cancel color="error" fontSize="small" /></ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>

            </Paper>
          </Grid>

          {/* Sticky Booking Card */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.5)',
                p: 2
              }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" fontWeight="600">
                    Price per person
                  </Typography>
                  <Typography variant="h3" color="primary.main" fontWeight="800" sx={{ mb: 3 }}>
                    ${tour.price}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px dashed #cbd5e1' }}>
                    <Typography color="text.secondary">Duration</Typography>
                    <Typography fontWeight="600">{tour.duration} Days</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, pb: 2, borderBottom: '1px dashed #cbd5e1' }}>
                    <Typography color="text.secondary">Max Group Size</Typography>
                    <Typography fontWeight="600">{tour.maxGroupSize} People</Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => setBookingDialog(true)}
                    sx={{
                      py: 1.8,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
                      '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
                    }}
                  >
                    BOOK THIS TOUR
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Reviews & Q&A */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', mb: 4 }}>
          <AddReviewForm
            establishmentId={String(tour.id)}
            establishmentType="TOUR"
          />
        </Paper>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', mb: 4 }}>
          <ReviewsList
            establishmentId={String(tour.id)}
            establishmentType="TOUR"
          />
        </Paper>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', mb: 4 }}>
          <QASection
            establishmentId={String(tour.id)}
            establishmentType="TOUR"
          />
        </Paper>
      </Container>

      {/* Booking Modal */}
      <BookingDialog
        open={bookingDialog}
        tour={tour}
        onClose={() => setBookingDialog(false)}
      />

    </Box>
  );
};

export default TourDetail;