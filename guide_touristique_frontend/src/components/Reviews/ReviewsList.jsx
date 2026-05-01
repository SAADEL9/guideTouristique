import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Avatar, Button, IconButton,
  Tooltip, TextField, Collapse, LinearProgress, CircularProgress,
  Alert, Divider, Chip
} from '@mui/material';
import {
  ThumbUp, ThumbDown, Flag, Reply, Person, RateReview, Star
} from '@mui/icons-material';
import ReviewService from '../../api/ReviewService';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_LABELS = { cleanliness: 'Cleanliness', service: 'Service', value: 'Value' };

const StarDisplay = ({ value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} sx={{ fontSize: 16, color: s <= Math.round(value) ? '#f59e0b' : '#d1d5db' }} />
    ))}
  </Box>
);

const ReviewCard = ({ review, currentUserId, isBusiness, isAdmin, onUpdate, onDelete }) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const helpful = review.helpfulVotes?.length || 0;
  const notHelpful = review.notHelpfulVotes?.length || 0;
  const hasVotedHelpful = currentUserId && review.helpfulVotes?.includes(currentUserId);
  const hasVotedNotHelpful = currentUserId && review.notHelpfulVotes?.includes(currentUserId);

  const handleVote = async (type) => {
    if (!currentUserId) return;
    try {
      const res = type === 'helpful'
        ? await ReviewService.voteHelpful(review.id)
        : await ReviewService.voteNotHelpful(review.id);
      onUpdate(res.data);
    } catch (err) {
      console.error('Vote error', err);
    }
  };

  const handleFlag = async () => {
    if (!currentUserId) return;
    try {
      const res = await ReviewService.flagReview(review.id);
      onUpdate(res.data);
    } catch (err) {
      console.error('Flag error', err);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await ReviewService.addOwnerReply(review.id, replyText.trim());
      onUpdate(res.data);
      setReplyOpen(false);
      setReplyText('');
    } catch (err) {
      console.error('Reply error', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await ReviewService.deleteReview(review.id);
      onDelete(review.id);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: 3, border: '1px solid #e2e8f0', background: 'white' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
        <Avatar sx={{ bgcolor: '#3b82f6', width: 44, height: 44, fontWeight: 700 }}>
          {review.username?.[0]?.toUpperCase() || <Person />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography fontWeight={700} sx={{ lineHeight: 1.2 }}>{review.username}</Typography>
              <StarDisplay value={review.globalRating} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {review.date ? new Date(review.date).toLocaleDateString() : ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8, mb: 2 }}>
        {review.text}
      </Typography>

      {review.categoryRatings && Object.keys(review.categoryRatings).length > 0 && (
        <Box sx={{ mb: 2, p: 2, background: '#f8fafc', borderRadius: 2 }}>
          {Object.entries(review.categoryRatings).map(([key, val]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography variant="caption" sx={{ width: 90, color: '#6b7280', fontWeight: 600, flexShrink: 0 }}>
                {CATEGORY_LABELS[key] || key}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(val / 5) * 100}
                sx={{
                  flex: 1, height: 6, borderRadius: 3, background: '#e2e8f0',
                  '& .MuiLinearProgress-bar': { background: '#3b82f6', borderRadius: 3 }
                }}
              />
              <Typography variant="caption" fontWeight={700} sx={{ width: 16, textAlign: 'right' }}>{val}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {review.ownerReply && (
        <Box sx={{ mt: 2, p: 2, background: '#eff6ff', borderRadius: 2, borderLeft: '3px solid #3b82f6' }}>
          <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ display: 'block', mb: 0.5 }}>
            Response from owner
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {review.ownerReply}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, pt: 2, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Helpful?</Typography>
        <Button
          size="small"
          startIcon={<ThumbUp sx={{ fontSize: '14px !important' }} />}
          onClick={() => handleVote('helpful')}
          sx={{ color: hasVotedHelpful ? '#2563eb' : '#6b7280', minWidth: 'auto', borderRadius: 2, fontSize: '0.75rem', fontWeight: hasVotedHelpful ? 700 : 400 }}
        >
          {helpful}
        </Button>
        <Button
          size="small"
          startIcon={<ThumbDown sx={{ fontSize: '14px !important' }} />}
          onClick={() => handleVote('not-helpful')}
          sx={{ color: hasVotedNotHelpful ? '#dc2626' : '#6b7280', minWidth: 'auto', borderRadius: 2, fontSize: '0.75rem', fontWeight: hasVotedNotHelpful ? 700 : 400 }}
        >
          {notHelpful}
        </Button>

        <Box sx={{ flex: 1 }} />

        {review.flagged && (
          <Chip label="Flagged" size="small" sx={{ background: '#fef2f2', color: '#dc2626', fontWeight: 700, height: 22 }} />
        )}

        {currentUserId && !review.flagged && currentUserId !== review.userId && (
          <Tooltip title="Flag this review">
            <IconButton size="small" onClick={handleFlag} sx={{ color: '#9ca3af', '&:hover': { color: '#ef4444' } }}>
              <Flag sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}

        {(isBusiness || isAdmin) && !review.ownerReply && (
          <Button
            size="small"
            startIcon={<Reply sx={{ fontSize: '14px !important' }} />}
            onClick={() => setReplyOpen(!replyOpen)}
            sx={{ color: '#2563eb', borderRadius: 2, fontSize: '0.75rem' }}
          >
            Reply
          </Button>
        )}

        {(isAdmin || currentUserId === review.userId) && (
          <Button
            size="small"
            onClick={handleDelete}
            sx={{ color: '#dc2626', borderRadius: 2, fontSize: '0.75rem' }}
          >
            Delete
          </Button>
        )}
      </Box>

      {replyOpen && (
        <Collapse in={replyOpen}>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              placeholder="Write your response as the owner..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
                sx={{ borderRadius: 2, fontSize: '0.8rem' }}
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </Button>
              <Button size="small" onClick={() => setReplyOpen(false)} sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Collapse>
      )}
    </Paper>
  );
};

const RatingSummary = ({ reviews }) => {
  if (!reviews.length) return null;
  const avg = reviews.reduce((sum, r) => sum + r.globalRating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.globalRating === star).length,
  }));

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 3, background: '#f8fafc', borderRadius: 3, mb: 3, flexWrap: 'wrap' }}>
      <Box sx={{ textAlign: 'center', minWidth: 80 }}>
        <Typography variant="h2" fontWeight={800} color="primary.main" sx={{ lineHeight: 1 }}>
          {avg.toFixed(1)}
        </Typography>
        <StarDisplay value={Math.round(avg)} />
        <Typography variant="caption" color="text.secondary">{reviews.length} reviews</Typography>
      </Box>
      <Box sx={{ flex: 1, minWidth: 160 }}>
        {counts.map(({ star, count }) => (
          <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="caption" sx={{ width: 10, fontWeight: 700 }}>{star}</Typography>
            <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
            <LinearProgress
              variant="determinate"
              value={reviews.length ? (count / reviews.length) * 100 : 0}
              sx={{
                flex: 1, height: 8, borderRadius: 4, background: '#e2e8f0',
                '& .MuiLinearProgress-bar': { background: '#f59e0b', borderRadius: 4 }
              }}
            />
            <Typography variant="caption" sx={{ width: 20, textAlign: 'right', color: '#6b7280' }}>{count}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ReviewsList = ({ establishmentId, establishmentType }) => {
  const { user, isAdmin, isBusiness } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!establishmentId) return;
    setLoading(true);
    ReviewService.getReviews(establishmentId, establishmentType)
      .then((res) => setReviews(res.data))
      .catch(() => setError('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, [establishmentId, establishmentType]);

  const handleUpdate = (updated) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <RateReview color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Reviews
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      {reviews.length > 0 ? (
        <>
          <RatingSummary reviews={reviews} />
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={user?.id}
              isBusiness={isBusiness?.()}
              isAdmin={isAdmin?.()}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5, background: '#f8fafc', borderRadius: 3 }}>
          <RateReview sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
          <Typography color="text.secondary">No reviews yet. Be the first to share your experience!</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReviewsList;
