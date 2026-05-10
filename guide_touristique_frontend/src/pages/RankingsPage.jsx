import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { LocationOn, AccessTime } from "@mui/icons-material";
import tourService from '../service/tourService';
import userService from '../service/userService';

const CORAL = '#FF6B35';
const BG = '#FAFAFA';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';

const Stars = ({ rating, size = 15 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? CORAL : '#E0E0E0' }}>★</span>
    ))}
  </Box>
);

const MEDAL = ['🥇', '🥈', '🥉'];

const RankingsPage = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    tourService.getTopRated()
      .then(async r => {
        const topTours = r.data || [];
        setTours(topTours);
        // Fetch stats for each tour in parallel
        const statsResults = await Promise.allSettled(
          topTours.map(t =>
            userService.getReviewStats(t.id, 'TOUR').then(sr => ({ id: t.id, ...sr.data }))
          )
        );
        const statsMap = {};
        statsResults.forEach(result => {
          if (result.status === 'fulfilled') {
            statsMap[result.value.id] = result.value;
          }
        });
        setStats(statsMap);
      })
      .catch(() => setError('Failed to load rankings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={40} thickness={3} sx={{ color: CORAL }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: BG, minHeight: '100vh', pb: 10 }}>
      {/* Header */}
      <Box sx={{ background: HERO_BG, borderBottom: `0.5px solid ${BORDER}`, py: { xs: 5, md: 7 }, px: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, background: ACCENT_LIGHT, color: CORAL, borderRadius: 999, px: 1.5, py: 0.5, fontSize: 12, fontWeight: 500, mb: 2 }}>
          🏆 Top rated
        </Box>
        <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 500, color: TEXT, letterSpacing: '-0.5px', mb: 1 }}>
          Tour Rankings
        </Typography>
        <Typography sx={{ color: MUTED, fontSize: 15 }}>
          Top 5 tours ranked by traveler ratings
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, md: 4 }, pt: 5 }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        {tours.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 8, background: WHITE, borderRadius: '12px', border: `0.5px solid ${BORDER}` }}>
            <Typography sx={{ fontSize: 36, mb: 1 }}>🏆</Typography>
            <Typography sx={{ color: TEXT, fontWeight: 500, mb: 0.5 }}>No rankings yet</Typography>
            <Typography sx={{ color: MUTED, fontSize: 14 }}>Tours will appear here once they receive reviews.</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tours.map((tour, idx) => {
            const tourStats = stats[tour.id] || {};
            const avg = tourStats.averageRating ?? 0;
            const count = tourStats.reviewCount ?? 0;

            return (
              <Box
                key={tour.id}
                onClick={() => navigate(`/tour/${tour.id}`)}
                sx={{
                  display: 'flex', gap: 2, alignItems: 'center',
                  background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '12px',
                  p: 2, cursor: 'pointer',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
                  '&:hover': { borderColor: '#FFD4C2', background: HERO_BG },
                }}
              >
                {/* Rank */}
                <Box sx={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {idx < 3 ? (
                    <Typography sx={{ fontSize: 28 }}>{MEDAL[idx]}</Typography>
                  ) : (
                    <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: 15, fontWeight: 600, color: CORAL }}>#{idx + 1}</Typography>
                    </Box>
                  )}
                </Box>

                {/* Thumbnail */}
                <Box sx={{ width: 80, height: 60, borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={tour.images?.[0] || 'https://via.placeholder.com/160x120?text=Tour'}
                    alt={tour.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 15, color: TEXT, mb: 0.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tour.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.6, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <LocationOn sx={{ fontSize: 12, color: MUTED }} />
                      <Typography sx={{ fontSize: 12, color: MUTED }}>{tour.meetingPoint || 'Multiple locations'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <AccessTime sx={{ fontSize: 12, color: MUTED }} />
                      <Typography sx={{ fontSize: 12, color: MUTED }}>{tour.duration} {tour.duration === 1 ? 'day' : 'days'}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Stars rating={avg} size={14} />
                    <Typography sx={{ fontSize: 12, color: MUTED }}>
                      {avg > 0 ? avg.toFixed(1) : 'No reviews'}{count > 0 ? ` (${count} review${count !== 1 ? 's' : ''})` : ''}
                    </Typography>
                  </Box>
                </Box>

                {/* Price */}
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 500, color: CORAL }}>${tour.price}</Typography>
                  <Typography sx={{ fontSize: 11, color: MUTED }}>per person</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default RankingsPage;
