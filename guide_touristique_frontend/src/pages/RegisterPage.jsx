import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField, Button, Typography, Box,
  Alert, CircularProgress, Card, CardContent
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import authService from '../service/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('traveler');
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
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

    // Si business → rediriger vers business-register
    if (accountType === 'business') {
      navigate('/business-register');
      return;
    }

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
      await authService.register(formData.username, formData.email, formData.password);
      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Registration successful! Please login.' }
        });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const accountTypes = [
    {
      value: 'traveler',
      icon: '🧳',
      label: 'Traveler',
      desc: 'Personal account for exploring tours & hotels',
    },
    {
      value: 'business',
      icon: '🏢',
      label: 'Business',
      desc: 'For hotels, tour operators & restaurants',
    },
  ];

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", backgroundColor: "#f0f2f5", padding: 2,
    }}>
      <Card sx={{
        width: "100%", maxWidth: 480, borderRadius: 4,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb",
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: "50%", background: "#EBF3FF",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
            }}>
              <PersonAdd sx={{ color: "#1565c0", fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="#111827">Create Account</Typography>
            <Typography variant="body2" color="text.secondary">Join Guide Touristique today</Typography>
          </Box>

          {/* Account type selector */}
          <Typography variant="caption" sx={{
            textTransform: "uppercase", letterSpacing: "0.6px",
            color: "#9ca3af", mb: 1, display: "block",
          }}>
            Choose account type
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
            {accountTypes.map((type) => (
              <Box key={type.value} onClick={() => setAccountType(type.value)} sx={{
                border: accountType === type.value ? "2px solid #1565c0" : "1.5px solid #e5e7eb",
                borderRadius: 3, padding: "14px 10px", cursor: "pointer",
                textAlign: "center", background: accountType === type.value ? "#EBF3FF" : "white",
                transition: "all 0.15s", position: "relative",
                "&:hover": { borderColor: "#1565c0", background: "#f5f8ff" },
              }}>
                {accountType === type.value && (
                  <Box sx={{
                    position: "absolute", top: 8, right: 8, width: 18, height: 18,
                    borderRadius: "50%", background: "#1565c0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Typography sx={{ color: "white", fontSize: 10, lineHeight: 1 }}>✓</Typography>
                  </Box>
                )}
                <Typography sx={{ fontSize: 26, mb: 0.5 }}>{type.icon}</Typography>
                <Typography variant="body2" fontWeight={600} color="#111827">{type.label}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                  {type.desc}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Form — caché si business */}
          {accountType === 'business' ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                Click below to fill in your business details
              </Typography>
              <Button fullWidth variant="contained" size="large" onClick={() => navigate('/business-register')}
                sx={{ py: 1.5, borderRadius: 2, background: "#1565c0", "&:hover": { background: "#1152a3" } }}>
                Continue as Business →
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <TextField fullWidth label="Username" name="username" margin="normal"
                value={formData.username} onChange={handleChange} required autoFocus />
              <TextField fullWidth label="Email" name="email" type="email" margin="normal"
                value={formData.email} onChange={handleChange} required />
              <TextField fullWidth label="Password" name="password" type="password" margin="normal"
                value={formData.password} onChange={handleChange} required />
              <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password"
                margin="normal" value={formData.confirmPassword} onChange={handleChange} required />

              <Button fullWidth variant="contained" size="large" type="submit" disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, background: "#1565c0",
                  "&:hover": { background: "#1152a3" } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "REGISTER"}
              </Button>

              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1565c0", fontWeight: 600 }}>Sign In</Link>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;