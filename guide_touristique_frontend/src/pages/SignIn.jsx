import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField, Button, Typography, Box,
  Alert, CircularProgress, Card, CardContent,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await login(formData.username, formData.password);

    console.log("LOGIN DATA:", data); // 👈 IMPORTANT

    // ✅ récupérer le token (adapter selon backend)
    const token = data.token || data.accessToken;

    if (!token) {
      setError("Token non reçu du backend");
      console.error("❌ Pas de token:", data);
      return;
    }

    // ✅ STOCKER LE TOKEN
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data));

    console.log("✅ Token saved:", token);

    // navigation selon rôle
    if (data.roles.includes("ROLE_ADMIN")) {
      navigate("/admin-dashboard");
    } else if (data.roles.includes("ROLE_BUSINESS")) {
      navigate("/business-dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", backgroundColor: "#f0f2f5", padding: 2,
    }}>
      <Card sx={{
        width: "100%", maxWidth: 440, borderRadius: 4,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb",
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: "50%", background: "#EBF3FF",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
            }}>
              <LockOutlined sx={{ color: "#1565c0", fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="#111827">Sign In</Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back to Guide Touristique
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Username" name="username" margin="normal"
              value={formData.username} onChange={handleChange} required autoFocus />
            <TextField fullWidth label="Password" name="password" type="password"
              margin="normal" value={formData.password} onChange={handleChange} required />

            <Button fullWidth variant="contained" size="large" type="submit"
              disabled={loading} sx={{
                mt: 3, mb: 2, py: 1.5, borderRadius: 2,
                background: "#1565c0", "&:hover": { background: "#1152a3" },
              }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN IN"}
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#1565c0", fontWeight: 600 }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignIn;