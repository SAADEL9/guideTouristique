import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from "@mui/material";
import { CheckCircle, Cancel, Tour, AdminPanelSettings, SecurityUpdateWarning, Flag, RateReview, Star } from "@mui/icons-material";
import axiosInstance from '../api/AxiosInstance';
import AdminReviewModeration from '../components/Reviews/AdminReviewModeration';

const AdminDashboard = () => {
  const [pendingTours, setPendingTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const [actionDialog, setActionDialog] = useState({ open: false, item: null, action: null });
  const [notes, setNotes] = useState('');

  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewDialog, setReviewDialog] = useState({ open: false, review: null, action: null });

  useEffect(() => {
    fetchPendingTours();
  }, []);

  useEffect(() => {
    if (tabValue === 1 && pendingReviews.length === 0 && !reviewsLoading) {
      fetchPendingReviews();
    }
  }, [tabValue]);

  const fetchPendingTours = async () => {
    try {
      const response = await axiosInstance.get('/tours/all');
      const pending = response.data.filter(t => t.status === 'PENDING');
      setPendingTours(pending);
    } catch (err) {
      setError('Failed to load pending tours');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAction = (item, action) => {
    setActionDialog({ open: true, item, action });
    setNotes('');
  };

  const fetchPendingReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await axiosInstance.get('/reviews/all');
      setPendingReviews(res.data.filter(r => r.status === 'PENDING'));
    } catch (err) {
      setError('Failed to load pending reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewAction = (review, action) => {
    setReviewDialog({ open: true, review, action });
  };

  const confirmReviewAction = async () => {
    const { review, action } = reviewDialog;
    const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
    try {
      await axiosInstance.put(`/reviews/${review.id}/status`, null, { params: { status } });
      setPendingReviews(prev => prev.filter(r => r.id !== review.id));
      setReviewDialog({ open: false, review: null, action: null });
    } catch (err) {
      setError('Failed to update review status');
    }
  };

  const confirmAction = async () => {
    try {
      const { item, action } = actionDialog;
      const statusValue = action === 'approved' ? 'APPROVED' : 'REJECTED';
      
      await axiosInstance.put(`/tours/${item.id}/status?status=${statusValue}`);
      
      setPendingTours(pendingTours.filter(t => t.id !== item.id));
      setActionDialog({ open: false, item: null, action: null });
    } catch (err) {
      alert('Failed to update tour status');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#020617' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#38bdf8' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', 
      minHeight: '100vh', 
      pb: 12,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Premium Command Center Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #000000 0%, #020617 100%)',
        color: 'white',
        py: { xs: 8, md: 10 },
        px: 2,
        mb: 8,
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Cyberpunk/High-Tech Accents */}
        <Box sx={{ 
          position: 'absolute', top: 0, left: '20%', width: '1px', height: '100%', 
          background: 'linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.5), transparent)' 
        }} />
        <Box sx={{ 
          position: 'absolute', top: 0, right: '20%', width: '1px', height: '100%', 
          background: 'linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.5), transparent)' 
        }} />
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', 
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(0,0,0,0) 70%)',
          animation: 'pulse 10s infinite alternate'
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ 
              p: 2, background: 'rgba(14,165,233,0.1)', borderRadius: '20px', 
              border: '1px solid rgba(14,165,233,0.3)', backdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(14,165,233,0.2)'
            }}>
              <AdminPanelSettings sx={{ fontSize: 50, color: '#38bdf8' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '1px', color: '#f8fafc', textTransform: 'uppercase' }}>
                Command Center
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#7dd3fc', fontSize: '1.1rem', mt: 0.5, letterSpacing: '0.5px' }}>
                Secure Platform Moderation & Management
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '16px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', backdropFilter: 'blur(10px)' }}>
            {error}
          </Alert>
        )}

        {/* Stats Row */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: '24px',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
              <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>
                    Pending Tours
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#f8fafc', fontWeight: 900 }}>
                    {pendingTours.length}
                  </Typography>
                </Box>
                <SecurityUpdateWarning sx={{ fontSize: 80, color: 'rgba(56, 189, 248, 0.2)' }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: '24px',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
              <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>
                    Pending Reviews
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#f8fafc', fontWeight: 900 }}>
                    {pendingReviews.length}
                  </Typography>
                </Box>
                <RateReview sx={{ fontSize: 80, color: 'rgba(245, 158, 11, 0.2)' }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            px: 3, pt: 3,
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' },
            '& .MuiTab-root': { color: '#94a3b8' },
            '& .Mui-selected': { color: '#38bdf8 !important' }
          }}>
            <Tab label={`Pending Tours (${pendingTours.length})`} sx={{ fontWeight: 700, fontSize: '1.1rem', textTransform: 'none' }} />
            <Tab icon={<RateReview sx={{ fontSize: 18 }} />} iconPosition="start" label={`Pending Reviews (${pendingReviews.length})`} sx={{ fontWeight: 700, fontSize: '1.1rem', textTransform: 'none' }} />
            <Tab icon={<Flag sx={{ fontSize: 18 }} />} iconPosition="start" label="Flagged Reviews" sx={{ fontWeight: 700, fontSize: '1.1rem', textTransform: 'none' }} />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {tabValue === 2 && <AdminReviewModeration />}

            {tabValue === 1 && (
              reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={50} thickness={4} sx={{ color: '#f59e0b' }} />
                </Box>
              ) : (
                <Grid container spacing={4}>
                  {pendingReviews.map((review) => (
                    <Grid item xs={12} md={6} key={review.id}>
                      <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '20px',
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)', borderColor: 'rgba(245, 158, 11, 0.4)', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.1)' }
                      }}>
                        <CardContent sx={{ flexGrow: 1, p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                            <Box sx={{ p: 1.5, background: 'rgba(245,158,11,0.1)', borderRadius: '12px', mr: 2 }}>
                              <RateReview sx={{ color: '#f59e0b' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                                {review.username}
                              </Typography>
                              <Box sx={{ display: 'flex', mt: 0.3 }}>
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} sx={{ fontSize: 13, color: s <= review.globalRating ? '#f59e0b' : 'rgba(255,255,255,0.15)' }} />
                                ))}
                              </Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {review.date ? new Date(review.date).toLocaleDateString() : ''}
                            </Typography>
                          </Box>

                          <Typography variant="body2" sx={{ mb: 3, color: '#cbd5e1', lineHeight: 1.7, minHeight: 56 }}>
                            {review.text?.length > 140 ? review.text.slice(0, 140) + '...' : review.text}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, p: 2, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</Typography>
                              <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>{review.establishmentType}</Typography>
                            </Box>
                            <Box textAlign="right">
                              <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</Typography>
                              <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 800 }}>{review.globalRating} / 5</Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              fullWidth
                              startIcon={<CheckCircle />}
                              onClick={() => handleReviewAction(review, 'approve')}
                              sx={{
                                borderRadius: '12px', py: 1.5, fontWeight: 800,
                                background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)',
                                '&:hover': { background: '#10b981', color: 'white', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              fullWidth
                              startIcon={<Cancel />}
                              onClick={() => handleReviewAction(review, 'reject')}
                              sx={{
                                borderRadius: '12px', py: 1.5, fontWeight: 800,
                                background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)',
                                '&:hover': { background: '#ef4444', color: 'white', boxShadow: '0 0 20px rgba(239,68,68,0.4)' }
                              }}
                            >
                              Reject
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  {pendingReviews.length === 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', py: 10 }}>
                        <CheckCircle sx={{ fontSize: 70, color: '#10b981', mb: 2, filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.5))' }} />
                        <Typography variant="h4" sx={{ color: '#f8fafc', fontWeight: 800, mb: 1 }}>All Clear</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                          No reviews are pending approval at this time.
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )
            )}

            {tabValue === 0 && (
              <Grid container spacing={4}>
                {pendingTours.map((tour) => (
                  <Grid item xs={12} md={6} key={tour.id}>
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '20px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255,255,255,0.05)',
                      '&:hover': { transform: 'translateY(-5px)', borderColor: 'rgba(56, 189, 248, 0.3)', boxShadow: '0 10px 30px rgba(14, 165, 233, 0.15)' }
                    }}>
                      <CardContent sx={{ flexGrow: 1, p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Box sx={{ p: 1.5, background: 'rgba(56,189,248,0.1)', borderRadius: '12px', mr: 2 }}>
                            <Tour sx={{ color: '#38bdf8' }} />
                          </Box>
                          <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                            {tour.title}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 4, color: '#cbd5e1', lineHeight: 1.7 }}>
                          {tour.description}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, p: 2, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</Typography>
                            <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>{tour.meetingPoint || 'N/A'}</Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</Typography>
                            <Typography variant="body2" sx={{ color: '#34d399', fontWeight: 800 }}>${tour.price}</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => handleAction(tour, 'approved')}
                            sx={{ 
                              borderRadius: '12px', py: 1.5, fontWeight: 800, 
                              background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)',
                              '&:hover': { background: '#10b981', color: 'white', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Cancel />}
                            onClick={() => handleAction(tour, 'rejected')}
                            sx={{ 
                              borderRadius: '12px', py: 1.5, fontWeight: 800, 
                              background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)',
                              '&:hover': { background: '#ef4444', color: 'white', borderColor: '#ef4444', boxShadow: '0 0 20px rgba(239,68,68,0.4)' }
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {pendingTours.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                      <CheckCircle sx={{ fontSize: 70, color: '#10b981', mb: 2, filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.5))' }} />
                      <Typography variant="h4" sx={{ color: '#f8fafc', fontWeight: 800, mb: 1 }}>
                        System Clear
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                        There are no pending tours requiring authorization at this time.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Review Action Dialog */}
      <Dialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ open: false, review: null, action: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: {
          borderRadius: '24px', p: 1,
          background: '#0f172a', color: 'white',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
        }}}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.5px', color: reviewDialog.action === 'approve' ? '#34d399' : '#f87171' }}>
          {reviewDialog.action === 'approve' ? 'APPROVE REVIEW' : 'REJECT REVIEW'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: '#cbd5e1' }}>
            Confirm action to <strong>{reviewDialog.action}</strong> the review by{' '}
            <span style={{ color: '#f8fafc', fontWeight: 700 }}>"{reviewDialog.review?.username}"</span>:
          </Typography>
          {reviewDialog.review?.text && (
            <Box sx={{ p: 2, background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                "{reviewDialog.review.text.slice(0, 160)}{reviewDialog.review.text.length > 160 ? '...' : ''}"
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button onClick={() => setReviewDialog({ open: false, review: null, action: null })} sx={{ color: '#94a3b8', fontWeight: 700, borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button
            onClick={confirmReviewAction}
            variant="contained"
            sx={{
              borderRadius: '10px', px: 4, fontWeight: 800,
              background: reviewDialog.action === 'approve' ? '#10b981' : '#ef4444',
              '&:hover': { background: reviewDialog.action === 'approve' ? '#059669' : '#dc2626' }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tour Action Dialog */}
      <Dialog
        open={actionDialog.open} 
        onClose={() => setActionDialog({ open: false, item: null, action: null })} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { 
          borderRadius: '24px', p: 1, 
          background: '#0f172a', color: 'white', 
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' 
        } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: actionDialog.action === 'approved' ? '#34d399' : '#f87171', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
          {actionDialog.action === 'approved' ? 'AUTHORIZE TOUR' : 'REJECT TOUR'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3, fontSize: '1.1rem', color: '#cbd5e1' }}>
            Confirm action to <strong>{actionDialog.action}</strong> the tour: <br/>
            <span style={{ color: '#f8fafc', fontWeight: 700 }}>"{actionDialog.item?.title}"</span>
          </Typography>

          {actionDialog.action === 'rejected' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide a reason for the log..."
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '12px', color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: '#f87171' }
                } 
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button onClick={() => setActionDialog({ open: false, item: null, action: null })} sx={{ color: '#94a3b8', fontWeight: 700, borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            sx={{ 
              borderRadius: '10px', px: 4, fontWeight: 800, 
              background: actionDialog.action === 'approved' ? '#10b981' : '#ef4444',
              '&:hover': { background: actionDialog.action === 'approved' ? '#059669' : '#dc2626' }
            }}
          >
            Confirm Execution
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;