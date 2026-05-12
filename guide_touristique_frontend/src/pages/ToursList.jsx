import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardMedia,
  Select, MenuItem, FormControl, CircularProgress, Alert, Button, Slider
} from "@mui/material";
import { Search, LocationOn, AccessTime, Star, FilterList, Close } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import tourService from '../service/tourService';

const CORAL = '#FF6B35';
const BG = '#FAFAFA';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';

const LANGUAGES = ['English', 'French', 'Spanish', 'Arabic', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'];

const ToursList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter state
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState('');

  // Track whether any server-side filter is active
  const hasFilters = city || language || minRating || priceRange[0] > 0 || priceRange[1] < 2000;

  useEffect(() => { fetchTours({}); }, []);

  const fetchTours = async (params) => {
    setLoading(true);
    setError('');
    try {
      const response = await tourService.getFilteredTours(params);
      setTours(response.data);
    } catch (err) {
      setError('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = {};
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 2000) params.maxPrice = priceRange[1];
    if (city.trim()) params.city = city.trim();
    if (language) params.language = language;
    if (minRating) params.minRating = minRating;
    fetchTours(params);
  };

  const clearFilters = () => {
    setCity('');
    setLanguage('');
    setPriceRange([0, 2000]);
    setMinRating('');
    setSearchQuery('');
    fetchTours({});
  };

  // Client-side title search on top of server results
  const displayed = searchQuery
    ? tours.filter(t =>
        (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.meetingPoint && t.meetingPoint.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tours;

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
      <Box sx={{ background: HERO_BG, borderBottom: `0.5px solid ${BORDER}`, py: { xs: 2, md: 3 }, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 500, color: TEXT, letterSpacing: '-0.3px' }}>
            Tours
          </Typography>
          <Typography sx={{ color: MUTED, fontSize: 13 }}>
            {tours.length} tours available
          </Typography>
        </Box>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, background: ACCENT_LIGHT, color: CORAL, borderRadius: 999, px: 1.5, py: 0.5, fontSize: 12, fontWeight: 500 }}>
          🎯 Explore our tours
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, pt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* Filter sidebar */}
          <Box sx={{ width: 240, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ background: WHITE, border: `0.5px solid ${BORDER}`, borderRadius: '12px', p: 2.5, position: 'sticky', top: 80 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <FilterList sx={{ fontSize: 16, color: CORAL }} />
                <Typography sx={{ fontWeight: 500, color: TEXT, fontSize: 14 }}>Filters</Typography>
              </Box>

              {/* City */}
              <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.8, display: 'block' }}>
                City / Destination
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', background: BG, border: `0.5px solid ${BORDER}`, borderRadius: '10px', px: 1.5, py: 0.5, mb: 2.5 }}>
                <LocationOn sx={{ fontSize: 14, color: MUTED, mr: 0.5 }} />
                <input
                  style={{ flex: 1, border: 'none', background: 'transparent', color: TEXT, fontSize: 13, outline: 'none', padding: '5px 0', fontFamily: 'inherit' }}
                  placeholder="e.g. Paris"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
                {city && (
                  <Close sx={{ fontSize: 14, color: MUTED, cursor: 'pointer' }} onClick={() => setCity('')} />
                )}
              </Box>

              {/* Price range */}
              <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.8, display: 'block' }}>
                Price range
              </Typography>
              <Box sx={{ px: 1, mb: 0.5 }}>
                <Slider
                  value={priceRange}
                  onChange={(_, v) => setPriceRange(v)}
                  min={0}
                  max={2000}
                  step={50}
                  sx={{
                    color: CORAL,
                    '& .MuiSlider-thumb': { width: 14, height: 14, '&:hover': { boxShadow: `0 0 0 6px ${ACCENT_LIGHT}` } },
                    '& .MuiSlider-rail': { color: BORDER },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                <Typography sx={{ fontSize: 12, color: MUTED }}>${priceRange[0]}</Typography>
                <Typography sx={{ fontSize: 12, color: MUTED }}>${priceRange[1] === 2000 ? '2000+' : priceRange[1]}</Typography>
              </Box>

              {/* Language */}
              <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.8, display: 'block' }}>
                Language
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '10px', fontSize: 13 }}
                >
                  <MenuItem value=""><em>Any language</em></MenuItem>
                  {LANGUAGES.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </Select>
              </FormControl>

              {/* Min rating */}
              <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.8, display: 'block' }}>
                Min rating
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <Select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '10px', fontSize: 13 }}
                >
                  <MenuItem value=""><em>Any rating</em></MenuItem>
                  {[4, 3, 2, 1].map(r => (
                    <MenuItem key={r} value={r}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {Array.from({ length: r }).map((_, i) => <Star key={i} sx={{ fontSize: 13, color: CORAL }} />)}
                        <Typography sx={{ fontSize: 12, color: MUTED, ml: 0.5 }}>{r}+</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Apply button */}
              <Button
                fullWidth
                onClick={applyFilters}
                sx={{ borderRadius: '20px', fontSize: 13, background: CORAL, color: WHITE, fontWeight: 500, mb: 1, '&:hover': { background: '#E85A25' } }}
              >
                Apply filters
              </Button>

              {hasFilters && (
                <Button
                  fullWidth
                  onClick={clearFilters}
                  sx={{ borderRadius: '20px', fontSize: 13, color: CORAL, border: `0.5px solid ${CORAL}`, '&:hover': { background: ACCENT_LIGHT } }}
                >
                  Clear all
                </Button>
              )}
            </Box>
          </Box>

          {/* Tours grid */}
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
              {searchQuery && (
                <Close sx={{ fontSize: 16, color: MUTED, cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
              )}
            </Box>

            {displayed.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, background: WHITE, borderRadius: '12px', border: `0.5px solid ${BORDER}` }}>
                <Typography sx={{ fontSize: 36, mb: 1 }}>🔍</Typography>
                <Typography sx={{ color: TEXT, fontWeight: 500, mb: 1 }}>No tours found</Typography>
                <Typography sx={{ color: MUTED, fontSize: 14, mb: 3 }}>Try adjusting your filters</Typography>
                <Button onClick={clearFilters} sx={{ borderRadius: '20px', color: CORAL, border: `0.5px solid ${CORAL}`, fontSize: 13, '&:hover': { background: ACCENT_LIGHT } }}>
                  Clear filters
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {displayed.map((tour) => (
                  <Grid item xs={6} sm={4} lg={3} key={tour.id}>
                    <Card
                      onClick={() => navigate(`/tour/${tour.id}`)}
                      sx={{
                        cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
                        borderRadius: '10px', border: `0.5px solid ${BORDER}`, background: WHITE,
                        transition: 'border-color 0.15s ease, background 0.15s ease',
                        '&:hover': { borderColor: '#FFD4C2', background: HERO_BG },
                      }}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden', paddingTop: '52%', borderRadius: '10px 10px 0 0' }}>
                        <CardMedia
                          component="img"
                          image={tour.images?.[0] || 'https://via.placeholder.com/400x250?text=Tour'}
                          alt={tour.title}
                          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)' } }}
                        />
                        <Box sx={{ position: 'absolute', top: 8, right: 8, background: CORAL, color: WHITE, borderRadius: '8px', px: 1, py: 0.3, fontSize: 12, fontWeight: 500 }}>
                          ${tour.price}
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5, pb: '12px !important' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: 13, color: TEXT, mb: 0.5, lineHeight: 1.3 }}>
                          {tour.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 1 }}>
                          <LocationOn sx={{ fontSize: 12, color: MUTED }} />
                          <Typography sx={{ fontSize: 11, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tour.meetingPoint || 'Multiple locations'}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                            <AccessTime sx={{ fontSize: 12, color: MUTED }} />
                            <Typography sx={{ fontSize: 11, color: MUTED }}>{tour.duration} {tour.duration === 1 ? 'day' : 'days'}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: 12, color: CORAL, fontWeight: 500 }}>View →</Typography>
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
