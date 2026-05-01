import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Grid, Card, CardContent,
  CardMedia, Chip, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, Divider, Paper, IconButton
} from "@mui/material";
import {
  LocationOn, AccessTime, CheckCircle, Cancel, Language,
  EventAvailable, ArrowBackIosNew, ArrowForwardIos, Star
} from "@mui/icons-material";
import BookingDialog from '../components/BookingDialog';
import ReviewsList from '../components/Reviews/ReviewsList';
import AddReviewForm from '../components/Reviews/AddReviewForm';
import QASection from '../components/QA/QASection';
import axiosInstance from '../api/AxiosInstance';

const CORAL = '#FF6B35';
const BG = '#FAFAFA';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => { fetchTour(); }, [id]);

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

  const nextImage = () => tour?.images?.length && setCurrentImageIndex((p) => (p + 1) % tour.images.length);
  const prevImage = () => tour?.images?.length && setCurrentImageIndex((p) => (p - 1 + tour.images.length) % tour.images.length);

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: BG }}>
        <CircularProgress size={40} thickness={3} sx={{ color: CORAL }} />
      </Box>
    );
  }

  if (error || !tour) {
    return (
      <Container sx={{ mt: 8, minHeight: '60vh' }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error || 'Tour not found'}</Alert>
      </Container>
    );
  }

  const images = tour.images?.length > 0 ? tour.images : ['https://via.placeholder.com/1200x600?text=No+Image'];

  return (
    <Box sx={{ background: BG, minHeight: '100vh', pb: 10 }}>
      {/* Hero image */}
      <Box sx={{ position: 'relative', height: { xs: 320, md: 480 }, overflow: 'hidden' }}>
        <CardMedia component="img" image={images[currentImageIndex]} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* Warm minimal overlay */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)' }} />

        {images.length > 1 && (
          <>
            <IconButton onClick={prevImage} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', color: TEXT, width: 36, height: 36, '&:hover': { background: WHITE } }}>
              <ArrowBackIosNew sx={{ fontSize: 14 }} />
            </IconButton>
            <IconButton onClick={nextImage} sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', color: TEXT, width: 36, height: 36, '&:hover': { background: WHITE } }}>
              <ArrowForwardIos sx={{ fontSize: 14 }} />
            </IconButton>
          </>
        )}

        {/* Title overlay */}
        <Container maxWidth="lg" sx={{ position: 'absolute', bottom: 28, left: 0, right: 0 }}>
          <Typography sx={{ fontWeight: 500, fontSize: { xs: 24, md: 34 }, color: WHITE, letterSpacing: '-0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.3)', mb: 0.5 }}>
            {tour.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', opacity: 0.92 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ color: WHITE, fontSize: 16 }} />
              <Typography sx={{ color: WHITE, fontSize: 14 }}>{tour.meetingPoint || 'N/A'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ color: WHITE, fontSize: 16 }} />
              <Typography sx={{ color: WHITE, fontSize: 14 }}>{tour.duration} days</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={3}>
          {/* Main content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE, mb: 3 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 16, color: TEXT, mb: 1.5 }}>About this tour</Typography>
              <Typography sx={{ color: MUTED, lineHeight: 1.8, fontSize: 14, mb: 3 }}>{tour.description}</Typography>

              <Divider sx={{ my: 3, borderColor: BORDER }} />

              <Typography sx={{ fontWeight: 500, fontSize: 15, color: TEXT, mb: 1.5 }}>Highlights</Typography>
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {tour.activities?.map((activity, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, background: HERO_BG, borderRadius: '10px', border: `0.5px solid ${BORDER}` }}>
                      <CheckCircle sx={{ color: CORAL, fontSize: 16 }} />
                      <Typography sx={{ fontSize: 13, color: TEXT }}>{activity}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3, borderColor: BORDER }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <EventAvailable sx={{ color: CORAL, fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 500, fontSize: 14, color: TEXT }}>Available dates</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {tour.availableDates?.map((date) => (
                      <Chip key={date} label={date} size="small" sx={{ borderRadius: '8px', background: ACCENT_LIGHT, color: CORAL, fontWeight: 500, fontSize: 12, border: 'none' }} />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Language sx={{ color: CORAL, fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 500, fontSize: 14, color: TEXT }}>Languages</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {tour.languages?.map((lang) => (
                      <Chip key={lang} label={lang} size="small" variant="outlined" sx={{ borderRadius: '8px', borderColor: BORDER, color: MUTED, fontSize: 12 }} />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, borderColor: BORDER }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, color: TEXT, mb: 1.5 }}>Included</Typography>
                  <List dense>
                    {tour.included?.map((item, i) => (
                      <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color: '#22c55e', fontSize: 15 }} /></ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ fontSize: 13, color: MUTED }} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, color: TEXT, mb: 1.5 }}>Not included</Typography>
                  <List dense>
                    {tour.notIncluded?.map((item, i) => (
                      <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}><Cancel sx={{ color: '#ef4444', fontSize: 15 }} /></ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ fontSize: 13, color: MUTED }} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Booking sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              <Card sx={{ borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE, p: 1 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 12, color: MUTED, mb: 0.5 }}>Price per person</Typography>
                  <Typography sx={{ fontSize: 32, fontWeight: 500, color: CORAL, mb: 2.5 }}>${tour.price}</Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: `0.5px solid ${BORDER}` }}>
                    <Typography sx={{ fontSize: 13, color: MUTED }}>Duration</Typography>
                    <Typography sx={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{tour.duration} days</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pb: 1.5, borderBottom: `0.5px solid ${BORDER}` }}>
                    <Typography sx={{ fontSize: 13, color: MUTED }}>Max group size</Typography>
                    <Typography sx={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{tour.maxGroupSize} people</Typography>
                  </Box>

                  <Button fullWidth variant="contained" size="large" onClick={() => setBookingDialog(true)}
                    sx={{ borderRadius: '20px', py: 1.4, fontWeight: 500, fontSize: 15, background: CORAL, '&:hover': { background: '#E85A25' } }}>
                    Book this tour
                  </Button>

                  {/* Star rating teaser */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', mt: 2 }}>
                    {[1,2,3,4,5].map((s) => <Star key={s} sx={{ fontSize: 14, color: CORAL }} />)}
                    <Typography variant="caption" sx={{ color: MUTED, ml: 0.5 }}>Highly rated</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Reviews & Q&A */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE, mt: 3, mb: 3 }}>
          <AddReviewForm establishmentId={String(tour.id)} establishmentType="TOUR" />
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE, mb: 3 }}>
          <ReviewsList establishmentId={String(tour.id)} establishmentType="TOUR" />
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE, mb: 3 }}>
          <QASection establishmentId={String(tour.id)} establishmentType="TOUR" />
        </Paper>
      </Container>

      <BookingDialog open={bookingDialog} tour={tour} onClose={() => setBookingDialog(false)} />
    </Box>
  );
};

export default TourDetail;
