import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField, Button, Container, Typography,
  Box, Alert, CircularProgress, Card, CardContent, Grid
} from "@mui/material";
import { Business } from "@mui/icons-material";
import authService from '../service/authService';

const BusinessRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    companyName: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authService.registerBusiness({
        username: formData.username,
        companyName: formData.companyName,
        description: formData.description,
        email: formData.email,
        contactInfo: `${formData.phone} - ${formData.address}`,
        password: formData.password,
      });
      setSuccess('Business registered! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error || err.response?.data || 'Registration failed';
      setError(typeof backendMessage === 'string' ? backendMessage : JSON.stringify(backendMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 12, minHeight: 560 }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
              alt="Business illustration"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, borderRadius: 4, boxShadow: 12, backdropFilter: 'blur(12px)' }}>
            <Typography variant="h5" gutterBottom>
              Register Your Business
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your business profile, publish tours and start attracting travelers with a premium listing.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField fullWidth required label="Username" name="username" value={formData.username} onChange={handleChange} autoFocus sx={{ mb: 2 }} />
              <TextField fullWidth required label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth required label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth required label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth required label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth required label="Address" name="address" value={formData.address} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth required label="Password" name="password" type="password" value={formData.password} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth required label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} sx={{ mb: 3 }} />

              <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ py: 1.8, mb: 2 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Business'}
              </Button>

              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign in</Link>
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BusinessRegisterPage;