import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Alert, Divider, IconButton } from '@mui/material';
import { Star, Edit, LockOutlined } from '@mui/icons-material';
import ReviewService from '../../api/ReviewService';
import { useAuth } from '../../context/AuthContext';

const CORAL = '#FF6B35';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';
const HERO_BG = '#FFF8F5';

const CATEGORIES = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'service', label: 'Service' },
  { key: 'value', label: 'Value for Money' },
];

const StarPicker = ({ value, onChange, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {label && (
      <Typography variant="body2" sx={{ width: 130, color: MUTED, fontSize: 13 }}>{label}</Typography>
    )}
    <Box sx={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <IconButton key={s} size="small" onClick={() => onChange(s)}
          sx={{ p: 0.2, color: s <= value ? CORAL : '#DDDDDD', '&:hover': { color: CORAL } }}>
          <Star sx={{ fontSize: 20 }} />
        </IconButton>
      ))}
    </Box>
    {value > 0 && <Typography variant="caption" sx={{ color: MUTED, ml: 0.5 }}>{value}/5</Typography>}
  </Box>
);

const AddReviewForm = ({ establishmentId, establishmentType, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const [globalRating, setGlobalRating] = useState(0);
  const [text, setText] = useState('');
  const [categoryRatings, setCategoryRatings] = useState({ cleanliness: 0, service: 0, value: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (globalRating === 0) { setError('Please select an overall rating.'); return; }
    if (!text.trim()) { setError('Please write a review.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await ReviewService.createReview({ establishmentId, establishmentType, globalRating, text: text.trim(), categoryRatings });
      setSuccess('Your review has been submitted and is pending approval.');
      setGlobalRating(0); setText(''); setCategoryRatings({ cleanliness: 0, service: 0, value: 0 });
      onReviewAdded?.(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 2.5, borderRadius: '12px', border: `0.5px dashed ${BORDER}`, textAlign: 'center', background: '#FAFAFA' }}>
        <LockOutlined sx={{ fontSize: 28, color: '#CCCCCC', mb: 0.5 }} />
        <Typography sx={{ color: MUTED, fontSize: 14 }}>
          Please <strong style={{ color: TEXT }}>sign in</strong> to write a review.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2.5, borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
        <Edit sx={{ color: CORAL, fontSize: 18 }} />
        <Typography sx={{ fontWeight: 500, fontSize: 15, color: TEXT }}>Write a review</Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1, display: 'block' }}>
          Overall rating *
        </Typography>
        <Box sx={{ mb: 2.5 }}>
          <StarPicker value={globalRating} onChange={setGlobalRating} />
        </Box>

        <TextField fullWidth multiline rows={4} label="Your review" placeholder="Share your experience with other travelers..."
          value={text} onChange={(e) => setText(e.target.value)} required
          sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: 14 } }} />

        <Divider sx={{ mb: 2, borderColor: BORDER }} />

        <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5, display: 'block' }}>
          Rate by category (optional)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
          {CATEGORIES.map(({ key, label }) => (
            <StarPicker key={key} value={categoryRatings[key]} onChange={(v) => setCategoryRatings((p) => ({ ...p, [key]: v }))} label={label} />
          ))}
        </Box>

        <Button type="submit" variant="contained" disabled={submitting}
          sx={{ borderRadius: '20px', px: 3.5, py: 1.1, fontWeight: 500, background: CORAL, '&:hover': { background: '#E85A25' } }}>
          {submitting ? 'Submitting...' : 'Submit review'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddReviewForm;
