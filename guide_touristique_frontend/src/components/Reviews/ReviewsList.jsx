import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Avatar, Button, IconButton, Tooltip,
  TextField, Collapse, LinearProgress, CircularProgress, Alert
} from '@mui/material';
import { ThumbUp, ThumbDown, Flag, Reply, Person, RateReview, Star } from '@mui/icons-material';
import ReviewService from '../../api/ReviewService';
import { useAuth } from '../../context/AuthContext';

const CORAL = '#FF6B35';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';
const HERO_BG = '#FFF8F5';

const CATEGORY_LABELS = { cleanliness: 'Cleanliness', service: 'Service', value: 'Value' };

const StarDisplay = ({ value }) => (
  <Box sx={{ display: 'flex' }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} sx={{ fontSize: 14, color: s <= Math.round(value) ? CORAL : '#E0E0E0' }} />
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
      const res = type === 'helpful' ? await ReviewService.voteHelpful(review.id) : await ReviewService.voteNotHelpful(review.id);
      onUpdate(res.data);
    } catch (err) { console.error(err); }
  };

  const handleFlag = async () => {
    if (!currentUserId) return;
    try { const res = await ReviewService.flagReview(review.id); onUpdate(res.data); } catch (err) { console.error(err); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await ReviewService.addOwnerReply(review.id, replyText.trim());
      onUpdate(res.data); setReplyOpen(false); setReplyText('');
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try { await ReviewService.deleteReview(review.id); onDelete(review.id); } catch (err) { console.error(err); }
  };

  return (
    <Box sx={{ p: 2.5, mb: 1.5, borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE }}>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
        <Avatar sx={{ bgcolor: ACCENT_LIGHT, color: CORAL, width: 38, height: 38, fontSize: 15, fontWeight: 500 }}>
          {review.username?.[0]?.toUpperCase() || <Person />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: 14, color: TEXT, lineHeight: 1.2 }}>{review.username}</Typography>
              <StarDisplay value={review.globalRating} />
            </Box>
            <Typography variant="caption" sx={{ color: MUTED }}>
              {review.date ? new Date(review.date).toLocaleDateString() : ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography sx={{ fontSize: 14, color: '#555', lineHeight: 1.75, mb: 1.5 }}>{review.text}</Typography>

      {review.categoryRatings && Object.keys(review.categoryRatings).length > 0 && (
        <Box sx={{ mb: 1.5, p: 1.5, background: '#FAFAFA', borderRadius: '8px', border: `0.5px solid ${BORDER}` }}>
          {Object.entries(review.categoryRatings).map(([key, val]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="caption" sx={{ width: 88, color: MUTED, fontWeight: 500, flexShrink: 0 }}>
                {CATEGORY_LABELS[key] || key}
              </Typography>
              <LinearProgress variant="determinate" value={(val / 5) * 100} sx={{ flex: 1, height: 5, borderRadius: 3, background: '#EEEEEE', '& .MuiLinearProgress-bar': { background: CORAL, borderRadius: 3 } }} />
              <Typography variant="caption" sx={{ width: 14, color: TEXT, fontWeight: 500 }}>{val}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {review.ownerReply && (
        <Box sx={{ mt: 1.5, p: 2, background: HERO_BG, borderRadius: '8px', borderLeft: `2px solid ${CORAL}` }}>
          <Typography variant="caption" sx={{ fontWeight: 500, color: CORAL, display: 'block', mb: 0.5 }}>Response from owner</Typography>
          <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>{review.ownerReply}</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, pt: 1.5, borderTop: `0.5px solid ${BORDER}`, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: MUTED, mr: 0.5 }}>Helpful?</Typography>
        <Button size="small" startIcon={<ThumbUp sx={{ fontSize: '13px !important' }} />} onClick={() => handleVote('helpful')}
          sx={{ color: hasVotedHelpful ? CORAL : MUTED, minWidth: 'auto', borderRadius: '20px', fontSize: '0.72rem', px: 1, fontWeight: hasVotedHelpful ? 500 : 400 }}>
          {helpful}
        </Button>
        <Button size="small" startIcon={<ThumbDown sx={{ fontSize: '13px !important' }} />} onClick={() => handleVote('not-helpful')}
          sx={{ color: hasVotedNotHelpful ? '#888' : MUTED, minWidth: 'auto', borderRadius: '20px', fontSize: '0.72rem', px: 1, fontWeight: hasVotedNotHelpful ? 500 : 400 }}>
          {notHelpful}
        </Button>
        <Box sx={{ flex: 1 }} />
        {review.flagged && (
          <Box sx={{ background: '#FEF2F2', color: '#DC2626', borderRadius: '8px', px: 1, py: 0.25, fontSize: 11, fontWeight: 500 }}>Flagged</Box>
        )}
        {currentUserId && !review.flagged && currentUserId !== review.userId && (
          <Tooltip title="Flag this review">
            <IconButton size="small" onClick={handleFlag} sx={{ color: '#CCCCCC', '&:hover': { color: '#ef4444' } }}>
              <Flag sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        )}
        {(isBusiness || isAdmin) && !review.ownerReply && (
          <Button size="small" startIcon={<Reply sx={{ fontSize: '13px !important' }} />} onClick={() => setReplyOpen(!replyOpen)}
            sx={{ color: CORAL, borderRadius: '20px', fontSize: '0.72rem', px: 1 }}>
            Reply
          </Button>
        )}
        {(isAdmin || currentUserId === review.userId) && (
          <Button size="small" onClick={handleDelete} sx={{ color: '#CCCCCC', borderRadius: '20px', fontSize: '0.72rem', px: 1, '&:hover': { color: '#ef4444' } }}>
            Delete
          </Button>
        )}
      </Box>

      <Collapse in={replyOpen}>
        <Box sx={{ mt: 1.5 }}>
          <TextField fullWidth size="small" multiline rows={2} placeholder="Write your response as the owner..." value={replyText} onChange={(e) => setReplyText(e.target.value)}
            sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: 13 } }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="contained" onClick={handleReply} disabled={submitting || !replyText.trim()}
              sx={{ borderRadius: '20px', background: CORAL, fontSize: '0.78rem', '&:hover': { background: '#E85A25' } }}>
              {submitting ? 'Posting...' : 'Post reply'}
            </Button>
            <Button size="small" onClick={() => setReplyOpen(false)} sx={{ borderRadius: '20px', fontSize: '0.78rem', color: MUTED }}>Cancel</Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

const RatingSummary = ({ reviews }) => {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.globalRating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.globalRating === star).length }));

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 2.5, background: HERO_BG, borderRadius: '12px', mb: 2.5, flexWrap: 'wrap', border: `0.5px solid ${BORDER}` }}>
      <Box sx={{ textAlign: 'center', minWidth: 72 }}>
        <Typography sx={{ fontSize: 36, fontWeight: 500, color: CORAL, lineHeight: 1 }}>{avg.toFixed(1)}</Typography>
        <StarDisplay value={Math.round(avg)} />
        <Typography variant="caption" sx={{ color: MUTED }}>{reviews.length} reviews</Typography>
      </Box>
      <Box sx={{ flex: 1, minWidth: 140 }}>
        {counts.map(({ star, count }) => (
          <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
            <Typography variant="caption" sx={{ width: 8, fontWeight: 500 }}>{star}</Typography>
            <Star sx={{ fontSize: 12, color: CORAL }} />
            <LinearProgress variant="determinate" value={reviews.length ? (count / reviews.length) * 100 : 0}
              sx={{ flex: 1, height: 6, borderRadius: 3, background: '#EEEEEE', '& .MuiLinearProgress-bar': { background: CORAL, borderRadius: 3 } }} />
            <Typography variant="caption" sx={{ width: 18, textAlign: 'right', color: MUTED }}>{count}</Typography>
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

  const handleUpdate = (updated) => setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  const handleDelete = (id) => setReviews((prev) => prev.filter((r) => r.id !== id));

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} sx={{ color: CORAL }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
        <RateReview sx={{ color: CORAL, fontSize: 20 }} />
        <Typography sx={{ fontWeight: 500, fontSize: 17, color: TEXT }}>Reviews</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      {reviews.length > 0 ? (
        <>
          <RatingSummary reviews={reviews} />
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} currentUserId={user?.id} isBusiness={isBusiness?.()} isAdmin={isAdmin?.()} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5, background: '#FAFAFA', borderRadius: '12px', border: `0.5px solid ${BORDER}` }}>
          <RateReview sx={{ fontSize: 40, color: '#DDDDDD', mb: 1 }} />
          <Typography sx={{ color: MUTED, fontSize: 14 }}>No reviews yet. Be the first to share your experience!</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReviewsList;
