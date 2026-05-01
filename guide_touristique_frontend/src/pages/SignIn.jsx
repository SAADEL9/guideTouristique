import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const CORAL = '#FF6B35';
const HERO_BG = '#FFF8F5';
const ACCENT_LIGHT = '#FFE8DF';
const BORDER = '#EEEEEE';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(formData.username, formData.password);
      const token = data.token || data.accessToken;
      if (!token) { setError("Authentication failed"); return; }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      if (data.roles.includes("ROLE_ADMIN")) navigate("/admin-dashboard");
      else if (data.roles.includes("ROLE_BUSINESS")) navigate("/business-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: HERO_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 400, background: '#FFFFFF', border: `0.5px solid ${BORDER}`, borderRadius: '16px', p: 4 }}>
        {/* Icon */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: 22 }}>
            🔑
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500, color: '#1A1A1A', mb: 0.5 }}>Sign in</Typography>
          <Typography variant="body2" sx={{ color: '#888888' }}>Welcome back to HiddenSpots</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Username" name="username" margin="normal"
            value={formData.username} onChange={handleChange} required autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          <TextField
            fullWidth label="Password" name="password" type="password" margin="normal"
            value={formData.password} onChange={handleChange} required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />

          <Button
            fullWidth type="submit" disabled={loading} variant="contained"
            sx={{ mt: 2.5, mb: 2, py: 1.3, borderRadius: '20px', background: CORAL, fontWeight: 500, fontSize: 15, '&:hover': { background: '#E85A25' } }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign in'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center', color: '#888888' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: CORAL, fontWeight: 500 }}>Register</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
