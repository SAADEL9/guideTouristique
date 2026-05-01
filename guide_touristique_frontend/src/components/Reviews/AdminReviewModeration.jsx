import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Chip, Avatar
} from '@mui/material';
import { CheckCircle, Cancel, Delete, Flag, RateReview, Star } from '@mui/icons-material';
import ReviewService from '../../api/ReviewService';

const STATUS_COLORS = {
  PENDING: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
  APPROVED: { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  REJECTED: { bg: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
};

const StarDisplay = ({ value }) => (
  <Box sx={{ display: 'flex' }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} sx={{ fontSize: 14, color: s <= value ? '#f59e0b' : 'rgba(255,255,255,0.2)' }} />
    ))}
  </Box>
);

const AdminReviewModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState({ open: false, review: null, action: null });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchFlaggedReviews();
  }, []);

  const fetchFlaggedReviews = async () => {
    try {
      const res = await ReviewService.getFlaggedReviews();
      setReviews(res.data);
    } catch (err) {
      setError('Failed to load flagged reviews');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (review, action) => setDialog({ open: true, review, action });
  const closeDialog = () => setDialog({ open: false, review: null, action: null });

  const confirmAction = async () => {
    const { review, action } = dialog;
    setProcessing(true);
    try {
      if (action === 'delete') {
        await ReviewService.deleteReview(review.id);
        setReviews((prev) => prev.filter((r) => r.id !== review.id));
      } else {
        const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
        const res = await ReviewService.updateReviewStatus(review.id, status);
        setReviews((prev) => prev.map((r) => (r.id === review.id ? res.data : r)));
      }
      closeDialog();
    } catch (err) {
      setError('Action failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={40} sx={{ color: '#38bdf8' }} />
      </Box>
    );
  }

  const actionMeta = {
    approve: { label: 'APPROVE REVIEW', color: '#34d399', hover: '#10b981', icon: <CheckCircle /> },
    reject: { label: 'REJECT REVIEW', color: '#f87171', hover: '#ef4444', icon: <Cancel /> },
    delete: { label: 'DELETE REVIEW', color: '#f87171', hover: '#dc2626', icon: <Delete /> },
  };

  return (
    <Box>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError('')}
          sx={{ mb: 3, borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          {error}
        </Alert>
      )}

      {reviews.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <CheckCircle sx={{ fontSize: 70, color: '#10b981', mb: 2, filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.5))' }} />
          <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 800, mb: 1 }}>No Flagged Reviews</Typography>
          <Typography sx={{ color: '#94a3b8' }}>All reviews are clear. Nothing requires moderation.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {reviews.map((review) => {
            const statusStyle = STATUS_COLORS[review.status] || STATUS_COLORS.PENDING;
            return (
              <Grid item xs={12} md={6} key={review.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  boxShadow: '0 4px 15px rgba(239,68,68,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 30px rgba(239,68,68,0.2)' }
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ p: 1, background: 'rgba(239,68,68,0.15)', borderRadius: '10px' }}>
                        <Flag sx={{ color: '#f87171', fontSize: 20 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ color: '#f8fafc', fontWeight: 700 }}>
                            {review.username}
                          </Typography>
                          <Chip
                            label={review.status}
                            size="small"
                            sx={{
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              border: `1px solid ${statusStyle.border}`,
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              height: 22
                            }}
                          />
                        </Box>
                        <StarDisplay value={review.globalRating} />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7, mb: 2, minHeight: 60 }}>
                      {review.text}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', mb: 2, p: 1.5, background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Type</Typography>
                        <Typography variant="caption" sx={{ color: '#f8fafc', fontWeight: 600 }}>{review.establishmentType}</Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Date</Typography>
                        <Typography variant="caption" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                          {review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        startIcon={<CheckCircle sx={{ fontSize: '14px !important' }} />}
                        onClick={() => openDialog(review, 'approve')}
                        sx={{
                          flex: 1, borderRadius: '10px', py: 1, fontWeight: 700, fontSize: '0.75rem',
                          background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)',
                          '&:hover': { background: '#10b981', color: 'white', boxShadow: '0 0 15px rgba(16,185,129,0.3)' }
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Cancel sx={{ fontSize: '14px !important' }} />}
                        onClick={() => openDialog(review, 'reject')}
                        sx={{
                          flex: 1, borderRadius: '10px', py: 1, fontWeight: 700, fontSize: '0.75rem',
                          background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)',
                          '&:hover': { background: '#ef4444', color: 'white', boxShadow: '0 0 15px rgba(239,68,68,0.3)' }
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Delete sx={{ fontSize: '14px !important' }} />}
                        onClick={() => openDialog(review, 'delete')}
                        sx={{
                          borderRadius: '10px', py: 1, fontWeight: 700, fontSize: '0.75rem',
                          background: 'rgba(100, 116, 139, 0.1)', color: '#94a3b8', border: '1px solid rgba(100, 116, 139, 0.3)',
                          '&:hover': { background: 'rgba(239,68,68,0.2)', color: '#f87171', borderColor: 'rgba(239,68,68,0.4)' }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px', p: 1,
            background: '#0f172a', color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
          }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px',
          color: dialog.action === 'approve' ? '#34d399' : '#f87171'
        }}>
          {dialog.action && actionMeta[dialog.action]?.label}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#cbd5e1', mb: 1 }}>
            Are you sure you want to <strong>{dialog.action}</strong> this review by{' '}
            <span style={{ color: '#f8fafc', fontWeight: 700 }}>"{dialog.review?.username}"</span>?
          </Typography>
          {dialog.review?.text && (
            <Box sx={{ p: 2, background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                "{dialog.review.text.slice(0, 120)}{dialog.review.text.length > 120 ? '...' : ''}"
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={closeDialog} disabled={processing} sx={{ color: '#94a3b8', fontWeight: 700, borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            disabled={processing}
            variant="contained"
            sx={{
              borderRadius: '10px', px: 3, fontWeight: 800,
              background: dialog.action === 'approve' ? '#10b981' : '#ef4444',
              '&:hover': { background: dialog.action === 'approve' ? '#059669' : '#dc2626' }
            }}
          >
            {processing ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminReviewModeration;
