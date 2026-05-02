import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, CircularProgress
} from "@mui/material";
import { CheckCircle, Cancel, Tour, AdminPanelSettings, Flag, RateReview, Star } from "@mui/icons-material";
import axiosInstance from '../api/AxiosInstance';
import AdminReviewModeration from '../components/Reviews/AdminReviewModeration';

const CORAL = '#FF6B35';
const CORAL_LIGHT = '#FFE8DF';
const CORAL_BG = '#FFF8F5';
const BORDER = '#EEEEEE';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const WHITE = '#FFFFFF';

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

  useEffect(() => { fetchPendingTours(); }, []);

  useEffect(() => {
    if (tabValue === 1 && pendingReviews.length === 0 && !reviewsLoading) {
      fetchPendingReviews();
    }
  }, [tabValue]);

  const fetchPendingTours = async () => {
    try {
      const response = await axiosInstance.get('/tours/all');
      setPendingTours(response.data.filter(t => t.status === 'PENDING'));
    } catch (err) {
      setError('Failed to load pending tours');
    } finally {
      setLoading(false);
    }
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

  const handleAction = (item, action) => { setActionDialog({ open: true, item, action }); setNotes(''); };
  const handleReviewAction = (review, action) => setReviewDialog({ open: true, review, action });

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
            <AdminPanelSettings sx={{ fontSize: 22, color: WHITE }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: WHITE }}>Admin dashboard</Typography>
          <Box sx={{ width: '1px', height: 16, background: 'rgba(255,255,255,0.3)', mx: 1 }} />
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Moderation & management</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ background: 'rgba(255,255,255,0.2)', color: WHITE, fontSize: 12, px: 1.5, py: 0.5, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tour sx={{ fontSize: 13 }} /> Tours {pendingTours.length}
          </Box>
          <Box sx={{ background: 'rgba(255,255,255,0.2)', color: WHITE, fontSize: 12, px: 1.5, py: 0.5, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RateReview sx={{ fontSize: 13 }} /> Reviews {pendingReviews.length}
          </Box>
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
            { label: 'Pending tours', value: pendingTours.length, icon: <Tour sx={{ fontSize: 20, color: CORAL }} /> },
            { label: 'Pending reviews', value: pendingReviews.length, icon: <RateReview sx={{ fontSize: 20, color: CORAL }} /> },
            { label: 'Flagged reviews', value: 0, icon: <Flag sx={{ fontSize: 20, color: CORAL }} /> },
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

        {/* Tabs + Content */}
        <Box sx={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', borderBottom: `0.5px solid ${BORDER}`, px: 2 }}>
            {[
              { label: 'Tours', count: pendingTours.length, icon: <Tour sx={{ fontSize: 15 }} /> },
              { label: 'Reviews', count: pendingReviews.length, icon: <RateReview sx={{ fontSize: 15 }} /> },
              { label: 'Flagged', count: 0, icon: <Flag sx={{ fontSize: 15 }} /> },
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
                {tab.icon}
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

          {/* Tab 0 — Pending Tours */}
          {tabValue === 0 && (
            <Box>
              {pendingTours.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Box sx={{ p: 2, background: CORAL_LIGHT, borderRadius: '50%', display: 'inline-flex', mb: 2 }}>
                    <CheckCircle sx={{ fontSize: 36, color: CORAL }} />
                  </Box>
                  <Typography sx={{ color: TEXT, fontWeight: 500 }}>No pending tours</Typography>
                  <Typography sx={{ color: MUTED, fontSize: 13, mt: 0.5 }}>All tours have been reviewed.</Typography>
                </Box>
              ) : pendingTours.map((tour, i) => (
                <Box key={tour.id} sx={{
                  display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2,
                  borderBottom: i < pendingTours.length - 1 ? `0.5px solid ${BORDER}` : 'none',
                  '&:hover': { background: CORAL_BG }, transition: 'background 0.15s'
                }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: CORAL_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Tour sx={{ fontSize: 18, color: CORAL }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: TEXT }}>{tour.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: MUTED }}>
                      {tour.meetingPoint || 'N/A'} · ${tour.price} · {tour.duration} day{tour.duration > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button size="small" onClick={() => handleAction(tour, 'approved')}
                      sx={{ background: CORAL, color: WHITE, borderRadius: '20px', px: 2, fontSize: 12, textTransform: 'none', '&:hover': { background: '#e55a25' }, minWidth: 0 }}>
                      Approve
                    </Button>
                    <Button size="small" onClick={() => handleAction(tour, 'rejected')}
                      sx={{ border: `0.5px solid ${BORDER}`, color: MUTED, borderRadius: '20px', px: 2, fontSize: 12, textTransform: 'none', '&:hover': { background: CORAL_BG, borderColor: CORAL, color: CORAL }, minWidth: 0 }}>
                      Reject
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Tab 1 — Pending Reviews */}
          {tabValue === 1 && (
            reviewsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={32} sx={{ color: CORAL }} />
              </Box>
            ) : (
              <Box>
                {pendingReviews.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Box sx={{ p: 2, background: CORAL_LIGHT, borderRadius: '50%', display: 'inline-flex', mb: 2 }}>
                      <CheckCircle sx={{ fontSize: 36, color: CORAL }} />
                    </Box>
                    <Typography sx={{ color: TEXT, fontWeight: 500 }}>No pending reviews</Typography>
                    <Typography sx={{ color: MUTED, fontSize: 13, mt: 0.5 }}>All reviews have been moderated.</Typography>
                  </Box>
                ) : pendingReviews.map((review, i) => (
                  <Box key={review.id} sx={{
                    display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2,
                    borderBottom: i < pendingReviews.length - 1 ? `0.5px solid ${BORDER}` : 'none',
                    '&:hover': { background: CORAL_BG }, transition: 'background 0.15s'
                  }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: '50%', background: CORAL_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Typography sx={{ color: CORAL, fontWeight: 500, fontSize: 14 }}>
                        {review.username?.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: TEXT }}>{review.username}</Typography>
                        <Box sx={{ display: 'flex' }}>
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} sx={{ fontSize: 11, color: s <= review.globalRating ? CORAL : BORDER }} />
                          ))}
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {review.text?.slice(0, 80)}{review.text?.length > 80 ? '...' : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <Button size="small" onClick={() => handleReviewAction(review, 'approve')}
                        sx={{ background: CORAL, color: WHITE, borderRadius: '20px', px: 2, fontSize: 12, textTransform: 'none', '&:hover': { background: '#e55a25' }, minWidth: 0 }}>
                        Approve
                      </Button>
                      <Button size="small" onClick={() => handleReviewAction(review, 'reject')}
                        sx={{ border: `0.5px solid ${BORDER}`, color: MUTED, borderRadius: '20px', px: 2, fontSize: 12, textTransform: 'none', '&:hover': { background: CORAL_BG, borderColor: CORAL, color: CORAL }, minWidth: 0 }}>
                        Reject
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )
          )}

          {/* Tab 2 — Flagged */}
          {tabValue === 2 && (
            <Box sx={{ p: 2 }}>
              <AdminReviewModeration />
            </Box>
          )}
        </Box>
      </Container>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, review: null, action: null })} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 500, color: TEXT, fontSize: 16 }}>
          {reviewDialog.action === 'approve' ? 'Approve review' : 'Reject review'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: MUTED, mb: 2 }}>
            Confirm action for review by <strong style={{ color: TEXT }}>{reviewDialog.review?.username}</strong>
          </Typography>
          {reviewDialog.review?.text && (
            <Box sx={{ p: 2, background: CORAL_BG, borderRadius: '8px', border: `0.5px solid #FFD4C2` }}>
              <Typography variant="body2" sx={{ color: MUTED, fontStyle: 'italic' }}>
                "{reviewDialog.review.text.slice(0, 160)}{reviewDialog.review.text.length > 160 ? '...' : ''}"
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setReviewDialog({ open: false, review: null, action: null })}
            sx={{ color: MUTED, textTransform: 'none', borderRadius: '20px' }}>Cancel</Button>
          <Button onClick={confirmReviewAction} variant="contained"
            sx={{ borderRadius: '20px', background: CORAL, '&:hover': { background: '#e55a25' }, textTransform: 'none', px: 3 }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tour Dialog */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, item: null, action: null })} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 500, color: TEXT, fontSize: 16 }}>
          {actionDialog.action === 'approved' ? 'Approve tour' : 'Reject tour'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: MUTED, mb: 2 }}>
            Confirm action for tour <strong style={{ color: TEXT }}>"{actionDialog.item?.title}"</strong>
          </Typography>
          {actionDialog.action === 'rejected' && (
            <TextField fullWidth multiline rows={3} label="Rejection reason (optional)" value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setActionDialog({ open: false, item: null, action: null })}
            sx={{ color: MUTED, textTransform: 'none', borderRadius: '20px' }}>Cancel</Button>
          <Button onClick={confirmAction} variant="contained"
            sx={{ borderRadius: '20px', background: CORAL, '&:hover': { background: '#e55a25' }, textTransform: 'none', px: 3 }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;