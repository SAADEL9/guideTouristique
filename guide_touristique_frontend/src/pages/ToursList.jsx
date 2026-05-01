import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Grid, Card, CardContent, CardMedia,
  Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Button
} from "@mui/material";
import { Search, LocationOn, AccessTime, Star } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';

const CORAL = '#FF6B35';
const BG = '#FAFAFA';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';

const ToursList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [filteredTours, setFilteredTours] = useState([]);

  useEffect(() => { fetchTours(); }, []);
  useEffect(() => { filterTours(); }, [tours, searchQuery, priceFilter, durationFilter]);

  const fetchTours = async () => {
    try {
      const response = await axiosInstance.get('/tours');
      setTours(response.data);
    } catch (err) {
      setError('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const filterTours = () => {
    let filtered = tours;
    if (searchQuery) {
      filtered = filtered.filter(t =>
        (t.meetingPoint && t.meetingPoint.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(t => max ? t.price >= min && t.price <= max : t.price >= min);
    }
    if (durationFilter) {
      filtered = filtered.filter(t => t.duration === parseInt(durationFilter, 10));
    }
    setFilteredTours(filtered);
  };

  const clearFilters = () => { setSearchQuery(''); setPriceFilter(''); setDurationFilter(''); };

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={40} thickness={3} sx={{ color: CORAL }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: BG, minHeight: '100vh', pb: 8 }}>
      {/* Page header */}
      <Box sx={{ background: HERO_BG, borderBottom: `0.5px solid ${BORDER}`, py: { xs: 5, md: 7 }, px: 3, textAlign: 'center', mb: 0 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, background: ACCENT_LIGHT, color: CORAL, borderRadius: 999, px: 1.5, py: 0.5, fontSize: 12, fontWeight: 500, mb: 2 }}>
          🎯 Explore our tours
        </Box>
        <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 500, color: TEXT, letterSpacing: '-0.5px', mb: 1 }}>
          Find your perfect tour
        </Typography>
        <Typography sx={{ color: MUTED, fontSize: 15 }}>
          {tours.length} tours available
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, pt: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* ── Filter sidebar ─────────────────────────────────── */}
          <Box sx={{ width: 240, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '12px', p: 2.5, position: 'sticky', top: 80 }}>
              <Typography sx={{ fontWeight: 500, color: TEXT, fontSize: 14, mb: 2 }}>Filters</Typography>

              <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.8, display: 'block' }}>
                Price range
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                <Select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '10px', fontSize: 13 }}
                >
                  <MenuItem value=""><em>All prices</em></MenuItem>
                  <MenuItem value="0-100">Under $100</MenuItem>
                  <MenuItem value="101-200">$100 – $200</MenuItem>
                  <MenuItem value="201-500">$200 – $500</MenuItem>
                  <MenuItem value="501">$500+</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.8, display: 'block' }}>
                Duration
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <Select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '10px', fontSize: 13 }}
                >
                  <MenuItem value=""><em>Any duration</em></MenuItem>
                  <MenuItem value="1">1 day</MenuItem>
                  <MenuItem value="2">2 days</MenuItem>
                  <MenuItem value="3">3 days</MenuItem>
                  <MenuItem value="7">1 week</MenuItem>
                </Select>
              </FormControl>

              {(priceFilter || durationFilter || searchQuery) && (
                <Button
                  fullWidth
                  onClick={clearFilters}
                  sx={{ borderRadius: '20px', fontSize: 13, color: CORAL, border: `0.5px solid ${CORAL}`, '&:hover': { background: ACCENT_LIGHT } }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          </Box>

          {/* ── Tours grid ─────────────────────────────────────── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Search bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '999px', px: 2, py: 0.5, mb: 3, maxWidth: 460 }}>
              <Search sx={{ color: MUTED, fontSize: 18, mr: 1 }} />
              <input
                style={{ flex: 1, border: 'none', background: 'transparent', color: TEXT, fontSize: 14, outline: 'none', padding: '6px 0', fontFamily: 'inherit' }}
                placeholder="Search tours or destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>

            {filteredTours.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, background: WHITE, borderRadius: '12px', border: `0.5px solid ${BORDER}` }}>
                <Typography sx={{ fontSize: 36, mb: 1 }}>🔍</Typography>
                <Typography sx={{ color: TEXT, fontWeight: 500, mb: 1 }}>No tours found</Typography>
                <Typography sx={{ color: MUTED, fontSize: 14, mb: 3 }}>Try adjusting your filters</Typography>
                <Button onClick={clearFilters} sx={{ borderRadius: '20px', color: CORAL, border: `0.5px solid ${CORAL}`, fontSize: 13, '&:hover': { background: ACCENT_LIGHT } }}>
                  Clear filters
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2.5}>
                {filteredTours.map((tour) => (
                  <Grid item xs={12} sm={6} lg={4} key={tour.id}>
                    <Card
                      onClick={() => navigate(`/tour/${tour.id}`)}
                      sx={{
                        cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
                        borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE,
                        transition: 'border-color 0.15s ease, background 0.15s ease',
                        '&:hover': { borderColor: '#FFD4C2', background: HERO_BG },
                      }}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden', paddingTop: '62%', borderRadius: '12px 12px 0 0' }}>
                        <CardMedia
                          component="img"
                          image={tour.images?.[0] || 'https://via.placeholder.com/400x250?text=Tour'}
                          alt={tour.title}
                          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)' } }}
                        />
                        {/* Price badge */}
                        <Box sx={{ position: 'absolute', top: 12, right: 12, background: CORAL, color: WHITE, borderRadius: '10px', px: 1.2, py: 0.4, fontSize: 13, fontWeight: 500 }}>
                          ${tour.price}
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5, pb: '20px !important' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: 15, color: TEXT, mb: 0.75, lineHeight: 1.3 }}>
                          {tour.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                          <LocationOn sx={{ fontSize: 13, color: MUTED }} />
                          <Typography sx={{ fontSize: 12, color: MUTED }}>{tour.meetingPoint || 'Multiple locations'}</Typography>
                        </Box>

                        <Typography sx={{ fontSize: 13, color: MUTED, mb: 2, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.55 }}>
                          {tour.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: 13, color: MUTED }} />
                            <Typography sx={{ fontSize: 12, color: MUTED }}>{tour.duration} {tour.duration === 1 ? 'day' : 'days'}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: 13, color: CORAL, fontWeight: 500 }}>View →</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ToursList;
