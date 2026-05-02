import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';
import {
  Container, Typography, Box, Button, Grid, Card, CardContent,
  CardMedia, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, IconButton
} from "@mui/material";
import { Add, Edit, Delete, Visibility, Storefront, TrendingUp, AttachMoney, TravelExplore } from "@mui/icons-material";

const CORAL = '#FF6B35';
const CORAL_LIGHT = '#FFE8DF';
const CORAL_BG = '#FFF8F5';
const BORDER = '#EEEEEE';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const WHITE = '#FFFFFF';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, tourId: null });

  useEffect(() => { fetchTours(); }, []);

  const fetchTours = async () => {
    try {
      const response = await axiosInstance.get('/tours/my-tours');
      setTours(response.data);
    } catch (err) {
      setError('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter(tour => {
    const status = tour.status?.toLowerCase() || '';
    if (tabValue === 0) return true;
    if (tabValue === 1) return status === 'approved';
    if (tabValue === 2) return status === 'pending';
    if (tabValue === 3) return status === 'rejected';
    return true;
  });

  const totalTours = tours.length;
  const totalBookings = tours.reduce((sum, tour) => sum + (tour.bookings || 0), 0);
  const totalRevenue = tours.reduce((sum, tour) => sum + (tour.bookings || 0) * tour.price, 0);

  const handleCreateTour = () => navigate('/tour-form');
  const handleEditTour = (tourId) => navigate(`/tour-form/${tourId}`);
  const handleViewTour = (tourId) => navigate(`/tour/${tourId}`);
  const handleDeleteTour = (tourId) => setDeleteDialog({ open: true, tourId });

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/tours/${deleteDialog.tourId}`);
      setTours(tours.filter(tour => tour.id !== deleteDialog.tourId));
      setDeleteDialog({ open: false, tourId: null });
    } catch (err) {
      alert('Failed to delete tour');
    }
  };

  const getStatusProps = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return { color: '#16a34a', bg: '#DCFCE7' };
      case 'pending': return { color: '#d97706', bg: '#FEF3C7' };
      case 'rejected': return { color: '#dc2626', bg: '#FEE2E2' };
      default: return { color: MUTED, bg: '#F0F0F0' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#FAFAFA' }}>
        <CircularProgress size={36} sx={{ color: CORAL }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: '#FAFAFA', minHeight: '100vh' }}>

      {/* Coral Header */}
      <Box sx={{ background: CORAL, px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
            <Storefront sx={{ fontSize: 22, color: WHITE }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: WHITE }}>Business dashboard</Typography>
          <Box sx={{ width: '1px', height: 16, background: 'rgba(255,255,255,0.3)', mx: 1 }} />
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Manage your tours</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={() => navigate('/reservations')}
            sx={{ color: WHITE, border: '0.5px solid rgba(255,255,255,0.4)', borderRadius: '20px', px: 2, py: 0.75, fontSize: 13, textTransform: 'none', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
          >
            Reservations
          </Button>
          <Button
            startIcon={<Add sx={{ fontSize: 16 }} />}
            onClick={handleCreateTour}
            sx={{ background: WHITE, color: CORAL, borderRadius: '20px', px: 2, py: 0.75, fontSize: 13, fontWeight: 500, textTransform: 'none', '&:hover': { background: CORAL_BG } }}
          >
            New tour
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total tours', value: totalTours, icon: <TravelExplore sx={{ fontSize: 20, color: CORAL }} /> },
            { label: 'Total bookings', value: totalBookings, icon: <TrendingUp sx={{ fontSize: 20, color: CORAL }} /> },
            { label: 'Estimated revenue', value: `$${totalRevenue}`, icon: <AttachMoney sx={{ fontSize: 20, color: CORAL }} /> },
          ].map((stat) => (
            <Grid item xs={12} md={4} key={stat.label}>
              <Box sx={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '12px', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: MUTED, mb: 0.5 }}>{stat.label}</Typography>
                  <Typography sx={{ fontSize: 28, fontWeight: 500, color: TEXT }}>{stat.value}</Typography>
                </Box>
                <Box sx={{ p: 1.5, background: CORAL_LIGHT, borderRadius: '10px' }}>
                  {stat.icon}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Box sx={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', borderBottom: `0.5px solid ${BORDER}`, px: 2 }}>
            {[
              { label: 'All', count: tours.length },
              { label: 'Approved', count: tours.filter(t => t.status?.toLowerCase() === 'approved').length },
              { label: 'Pending', count: tours.filter(t => t.status?.toLowerCase() === 'pending').length },
              { label: 'Rejected', count: tours.filter(t => t.status?.toLowerCase() === 'rejected').length },
            ].map((tab, i) => (
              <Box
                key={tab.label}
                onClick={() => setTabValue(i)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  px: 2, py: 1.5, cursor: 'pointer', fontSize: 13,
                  color: tabValue === i ? CORAL : MUTED,
                  borderBottom: tabValue === i ? `2px solid ${CORAL}` : '2px solid transparent',
                  fontWeight: tabValue === i ? 500 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
                <Box sx={{
                  background: tabValue === i ? CORAL : '#F0F0F0',
                  color: tabValue === i ? WHITE : MUTED,
                  fontSize: 10, px: 0.75, py: 0.25, borderRadius: '10px', lineHeight: 1.6
                }}>
                  {tab.count}
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 3 }}>
            {filteredTours.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Box sx={{ p: 2, background: CORAL_LIGHT, borderRadius: '50%', display: 'inline-flex', mb: 2 }}>
                  <Storefront sx={{ fontSize: 36, color: CORAL }} />
                </Box>
                <Typography sx={{ color: TEXT, fontWeight: 500, mb: 0.5 }}>No tours found</Typography>
                <Typography sx={{ color: MUTED, fontSize: 13, mb: 3 }}>
                  {tabValue === 0 ? "You haven't created any tours yet." : `No ${['all', 'approved', 'pending', 'rejected'][tabValue]} tours.`}
                </Typography>
                {tabValue === 0 && (
                  <Button
                    startIcon={<Add />}
                    onClick={handleCreateTour}
                    sx={{ background: CORAL, color: WHITE, borderRadius: '20px', px: 3, textTransform: 'none', '&:hover': { background: '#e55a25' } }}
                  >
                    Create your first tour
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredTours.map((tour) => {
                  const statusTheme = getStatusProps(tour.status);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={tour.id}>
                      <Card sx={{
                        borderRadius: '12px', border: `0.5px solid ${BORDER}`, boxShadow: 'none',
                        '&:hover': { borderColor: CORAL }, transition: 'border-color 0.2s',
                        height: '100%', display: 'flex', flexDirection: 'column'
                      }}>
                        <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                          <CardMedia
                            component="img"
                            image={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/400x200?text=No+Image'}
                            alt={tour.title}
                            sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <Box sx={{
                            position: 'absolute', top: 10, right: 10,
                            background: statusTheme.bg, color: statusTheme.color,
                            fontSize: 11, px: 1, py: 0.25, borderRadius: '20px', fontWeight: 500
                          }}>
                            {tour.status || 'UNKNOWN'}
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 500, color: TEXT, mb: 0.5 }}>
                            {tour.title}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: MUTED, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                            {tour.description}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', background: CORAL_BG, borderRadius: '8px', p: 1.5, mb: 2 }}>
                            <Box>
                              <Typography sx={{ fontSize: 11, color: MUTED }}>Price</Typography>
                              <Typography sx={{ fontSize: 14, fontWeight: 500, color: CORAL }}>${tour.price}</Typography>
                            </Box>
                            <Box textAlign="right">
                              <Typography sx={{ fontSize: 11, color: MUTED }}>Bookings</Typography>
                              <Typography sx={{ fontSize: 14, fontWeight: 500, color: TEXT }}>{tour.bookings || 0}</Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                            <Button
                              size="small"
                              startIcon={<Visibility sx={{ fontSize: 14 }} />}
                              onClick={() => handleViewTour(tour.id)}
                              sx={{ flex: 1, borderRadius: '20px', border: `0.5px solid ${BORDER}`, color: MUTED, fontSize: 12, textTransform: 'none', '&:hover': { background: CORAL_BG, borderColor: CORAL, color: CORAL } }}
                            >
                              View
                            </Button>
                            <IconButton size="small" onClick={() => handleEditTour(tour.id)}
                              sx={{ background: '#EFF6FF', color: '#3B82F6', borderRadius: '8px', '&:hover': { background: '#DBEAFE' } }}>
                              <Edit sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteTour(tour.id)}
                              sx={{ background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', '&:hover': { background: '#FEE2E2' } }}>
                              <Delete sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Box>
      </Container>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, tourId: null })} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 500, color: TEXT, fontSize: 16 }}>Delete tour</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: MUTED }}>
            Are you sure you want to delete this tour? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialog({ open: false, tourId: null })}
            sx={{ color: MUTED, textTransform: 'none', borderRadius: '20px' }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained"
            sx={{ borderRadius: '20px', background: '#EF4444', '&:hover': { background: '#DC2626' }, textTransform: 'none', px: 3 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessDashboard;