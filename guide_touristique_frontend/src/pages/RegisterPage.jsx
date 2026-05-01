import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, CircularProgress } from "@mui/material";
import authService from '../service/authService';

const CORAL = '#FF6B35';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const BORDER = '#EEEEEE';

const accountTypes = [
  { value: 'traveler', icon: '🧳', label: 'Traveler', desc: 'Explore tours & hotels' },
  { value: 'business', icon: '🏢', label: 'Business', desc: 'Hotels, tours & restaurants' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('traveler');
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (accountType === 'business') { navigate('/business-register'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await authService.register(formData.username, formData.email, formData.password);
      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => navigate('/login', { state: { message: 'Registration successful! Please login.' } }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: HERO_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 440, background: '#FFFFFF', border: `0.5px solid ${BORDER}`, borderRadius: '16px', p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: 22 }}>
            ✨
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500, color: '#1A1A1A', mb: 0.5 }}>Create account</Typography>
          <Typography variant="body2" sx={{ color: '#888888' }}>Join HiddenSpots today</Typography>
        </Box>

        {/* Account type selector */}
        <Typography variant="caption" sx={{ color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1, display: 'block' }}>
          Account type
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
          {accountTypes.map((t) => (
            <Box
              key={t.value}
              onClick={() => setAccountType(t.value)}
              sx={{
                border: `${accountType === t.value ? '1.5px' : '0.5px'} solid ${accountType === t.value ? CORAL : BORDER}`,
                borderRadius: '10px', p: '14px 10px', cursor: 'pointer', textAlign: 'center',
                background: accountType === t.value ? ACCENT_LIGHT : '#FFFFFF',
                transition: 'all 0.15s', position: 'relative',
                '&:hover': { borderColor: CORAL },
              }}
            >
              {accountType === t.value && (
                <Box sx={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'white', fontSize: 9, lineHeight: 1 }}>✓</Typography>
                </Box>
              )}
              <Typography sx={{ fontSize: 24, mb: 0.5 }}>{t.icon}</Typography>
              <Typography sx={{ fontWeight: 500, fontSize: 13, color: '#1A1A1A', mb: 0.25 }}>{t.label}</Typography>
              <Typography variant="caption" sx={{ color: '#888888', lineHeight: 1.3 }}>{t.desc}</Typography>
            </Box>
          ))}
        </Box>

        {accountType === 'business' ? (
          <Box>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#888888', mb: 2 }}>
              Click below to fill in your business details
            </Typography>
            <Button
              fullWidth variant="contained" onClick={() => navigate('/business-register')}
              sx={{ py: 1.3, borderRadius: '20px', background: CORAL, fontWeight: 500, '&:hover': { background: '#E85A25' } }}
            >
              Continue as Business →
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

            <TextField fullWidth label="Username" name="username" margin="normal" value={formData.username} onChange={handleChange} required autoFocus sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            <TextField fullWidth label="Email" name="email" type="email" margin="normal" value={formData.email} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            <TextField fullWidth label="Password" name="password" type="password" margin="normal" value={formData.password} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" margin="normal" value={formData.confirmPassword} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

            <Button
              fullWidth type="submit" disabled={loading} variant="contained"
              sx={{ mt: 2.5, mb: 2, py: 1.3, borderRadius: '20px', background: CORAL, fontWeight: 500, fontSize: 15, '&:hover': { background: '#E85A25' } }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create account'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#888888' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: CORAL, fontWeight: 500 }}>Sign in</Link>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RegisterPage;
