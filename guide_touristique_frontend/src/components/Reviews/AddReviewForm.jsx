import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Alert, Divider, IconButton
} from '@mui/material';
import { Star, Edit, LockOutlined } from '@mui/icons-material';
import ReviewService from '../../api/ReviewService';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'service', label: 'Service' },
  { key: 'value', label: 'Value for Money' },
];

const StarPicker = ({ value, onChange, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {label && (
      <Typography variant="body2" sx={{ width: 130, color: '#4b5563', fontWeight: 500 }}>
        {label}
      </Typography>
    )}
    <Box sx={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <IconButton
          key={s}
          size="small"
          onClick={() => onChange(s)}
          sx={{ p: 0.3, color: s <= value ? '#f59e0b' : '#d1d5db', '&:hover': { color: '#f59e0b' } }}
        >
          <Star sx={{ fontSize: 22 }} />
        </IconButton>
      ))}
    </Box>
    {value > 0 && (
      <Typography variant="caption" sx={{ color: '#6b7280', ml: 0.5 }}>
        {value}/5
      </Typography>
    )}
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

  const handleCategoryChange = (key, val) => {
    setCategoryRatings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (globalRating === 0) {
      setError('Please select an overall rating.');
      return;
    }
    if (!text.trim()) {
      setError('Please write a review.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await ReviewService.createReview({
        establishmentId,
        establishmentType,
        globalRating,
        text: text.trim(),
        categoryRatings,
      });
      setSuccess('Your review has been submitted and is pending approval.');
      setGlobalRating(0);
      setText('');
      setCategoryRatings({ cleanliness: 0, service: 0, value: 0 });
      onReviewAdded?.(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px dashed #cbd5e1', textAlign: 'center', background: '#f8fafc' }}>
        <LockOutlined sx={{ fontSize: 36, color: '#9ca3af', mb: 1 }} />
        <Typography variant="body1" color="text.secondary">
          Please <strong>sign in</strong> to write a review.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', background: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Edit color="primary" />
        <Typography variant="h6" fontWeight={700}>Write a Review</Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: '#374151' }}>
            Overall Rating *
          </Typography>
          <StarPicker value={globalRating} onChange={setGlobalRating} />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your Review"
          placeholder="Share your experience with other travelers..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <Divider sx={{ mb: 2.5 }} />

        <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151' }}>
          Rate by Category (optional)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          {CATEGORIES.map(({ key, label }) => (
            <StarPicker
              key={key}
              value={categoryRatings[key]}
              onChange={(val) => handleCategoryChange(key, val)}
              label={label}
            />
          ))}
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.2,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddReviewForm;
