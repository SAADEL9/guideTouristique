import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  IconButton
} from "@mui/material";
import { Add, Edit, Delete, Visibility, Storefront, TrendingUp, AttachMoney, TravelExplore } from "@mui/icons-material";

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, tourId: null });

  useEffect(() => {
    fetchTours();
  }, []);

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredTours = tours.filter(tour => {
    const status = tour.status ? tour.status.toLowerCase() : '';
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
      case 'approved': return { color: '#10b981', bg: 'rgba(16,185,129,0.15)' };
      case 'pending': return { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
      case 'rejected': return { color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
      default: return { color: '#64748b', bg: 'rgba(100,116,139,0.15)' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
      minHeight: '100vh', 
      pb: 12,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Premium Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        px: 2,
        mb: 8,
        position: 'relative',
        overflow: 'hidden',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px',
        boxShadow: '0 25px 50px -12px rgba(6, 78, 59, 0.4)'
      }}>
        {/* Animated Background Flares */}
        <Box sx={{ 
          position: 'absolute', top: '-20%', left: '10%', width: '300px', height: '300px', 
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, rgba(0,0,0,0) 70%)',
          animation: 'pulse 8s infinite alternate'
        }} />
        <Box sx={{ 
          position: 'absolute', bottom: '-20%', right: '5%', width: '400px', height: '400px', 
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)',
          animation: 'pulse 12s infinite alternate-reverse'
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ 
                p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: '20px', 
                border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'
              }}>
                <Storefront sx={{ fontSize: 48, color: '#34d399' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                  Business Dashboard
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#a7f3d0', fontSize: '1.1rem', mt: 0.5 }}>
                  Grow your business and manage your tours
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/reservations')}
                sx={{ 
                  color: 'white', borderColor: 'rgba(255,255,255,0.3)', borderRadius: '12px', py: 1.5, px: 3,
                  background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                  fontWeight: 600, transition: 'all 0.3s',
                  '&:hover': { background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.5)', transform: 'translateY(-2px)' }
                }}
              >
                Manage Reservations
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateTour}
                sx={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', fontWeight: 700, borderRadius: '12px', py: 1.5, px: 3,
                  boxShadow: '0 8px 20px rgba(16,185,129,0.3)', transition: 'all 0.3s',
                  '&:hover': { background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(16,185,129,0.4)' } 
                }}
              >
                Create New Tour
              </Button>
            </Box>
          </Box>
        </Container>

        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1) translate(0, 0); }
              100% { transform: scale(1.1) translate(15px, -15px); }
            }
          `}
        </style>
      </Box>

      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '16px', background: 'rgba(254,226,226,0.8)', backdropFilter: 'blur(10px)' }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            { label: 'Total Tours', value: totalTours, icon: <TravelExplore fontSize="large" />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Total Bookings', value: totalBookings, icon: <TrendingUp fontSize="large" />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Estimated Revenue', value: `$${totalRevenue}`, icon: <AttachMoney fontSize="large" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }
          ].map((stat, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ 
                borderRadius: '24px', 
                background: 'rgba(255, 255, 255, 0.7)', 
                backdropFilter: 'blur(20px)', 
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 15px 35px ${stat.bg}`,
                  borderColor: 'rgba(255,255,255,0.8)'
                }
              }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ background: stat.bg, p: 2.5, borderRadius: '20px', color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 900, mt: 0.5 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ 
            borderBottom: '1px solid rgba(0,0,0,0.05)', 
            px: 3, pt: 3,
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', background: '#10b981' }
          }}>
            <Tab label={`All Tours (${tours.length})`} sx={{ fontWeight: 600, fontSize: '1rem', textTransform: 'none' }} />
            <Tab label={`Approved (${tours.filter(t => t.status?.toLowerCase() === 'approved').length})`} sx={{ fontWeight: 600, fontSize: '1rem', textTransform: 'none' }} />
            <Tab label={`Pending (${tours.filter(t => t.status?.toLowerCase() === 'pending').length})`} sx={{ fontWeight: 600, fontSize: '1rem', textTransform: 'none' }} />
            <Tab label={`Rejected (${tours.filter(t => t.status?.toLowerCase() === 'rejected').length})`} sx={{ fontWeight: 600, fontSize: '1rem', textTransform: 'none' }} />
          </Tabs>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {filteredTours.map((tour) => {
                const statusTheme = getStatusProps(tour.status);
                return (
                  <Grid item xs={12} sm={6} md={4} key={tour.id}>
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '20px',
                      background: 'white',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }
                    }}>
                      <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/400x200?text=No+Image'}
                          alt={tour.title}
                          sx={{ 
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            transition: 'transform 0.5s ease',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        />
                        <Chip
                          label={tour.status || 'UNKNOWN'}
                          sx={{ 
                            position: 'absolute', top: 16, right: 16, fontWeight: 800, 
                            color: statusTheme.color, background: statusTheme.bg,
                            backdropFilter: 'blur(8px)', border: `1px solid ${statusTheme.color}40`
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                          {tour.title}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 3, color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                          {tour.description}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, p: 2, background: '#f8fafc', borderRadius: '12px' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Price</Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 800 }}>${tour.price}</Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Bookings</Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 800 }}>{tour.bookings || 0}</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, mt: 'auto' }}>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewTour(tour.id)}
                            sx={{ flex: 1, borderRadius: '10px', background: '#f1f5f9', color: '#475569', fontWeight: 600, '&:hover': { background: '#e2e8f0' } }}
                          >
                            View
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => handleEditTour(tour.id)}
                            sx={{ color: '#3b82f6', background: '#eff6ff', borderRadius: '10px', transition: 'all 0.2s', '&:hover': { background: '#dbeafe', transform: 'scale(1.05)' } }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTour(tour.id)}
                            sx={{ color: '#ef4444', background: '#fef2f2', borderRadius: '10px', transition: 'all 0.2s', '&:hover': { background: '#fee2e2', transform: 'scale(1.05)' } }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}

              {filteredTours.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 10, background: 'rgba(255,255,255,0.5)', borderRadius: '24px' }}>
                    <Storefront sx={{ fontSize: 70, color: '#94a3b8', mb: 2, opacity: 0.4 }} />
                    <Typography variant="h5" sx={{ color: '#475569', fontWeight: 700, mb: 1 }}>
                      {tabValue === 0 ? 'Ready to share your world?' : `No ${['all', 'approved', 'pending', 'rejected'][tabValue]} tours found.`}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
                      {tabValue === 0 ? "You haven't created any tours yet. Let's build something amazing." : "Try adjusting your filters to see more results."}
                    </Typography>
                    {tabValue === 0 && (
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreateTour}
                        sx={{ background: '#10b981', color: 'white', fontWeight: 700, borderRadius: '12px', px: 4, py: 1.5, boxShadow: '0 8px 20px rgba(16,185,129,0.3)', '&:hover': { background: '#059669', boxShadow: '0 12px 25px rgba(16,185,129,0.4)' } }}
                      >
                        Create Your First Tour
                      </Button>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialog.open} 
          onClose={() => setDeleteDialog({ open: false, tourId: null })}
          PaperProps={{ sx: { borderRadius: '24px', p: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: '#b91c1c', fontSize: '1.5rem' }}>Delete Tour</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: '1.1rem', color: '#475569' }}>
              Are you sure you want to delete this tour? This action cannot be undone and will permanently remove it from the platform.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
            <Button onClick={() => setDeleteDialog({ open: false, tourId: null })} sx={{ color: '#64748b', fontWeight: 700, borderRadius: '10px' }}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained" sx={{ borderRadius: '10px', px: 4, fontWeight: 700, background: '#ef4444', '&:hover': { background: '#dc2626' } }}>
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BusinessDashboard;