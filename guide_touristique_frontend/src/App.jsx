import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from "./context/AuthContext";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import theme from './theme';
import HomePage from './pages/HomePage';
import LoginPage from './pages/SignIn';
import RegisterPage from './pages/RegisterPage';
import BusinessRegister from './pages/BusinessRegister';
import Dashboard from './pages/Dashboard';
import ToursList from './pages/ToursList';
import TourDetail from './pages/TourDetail';
import TourForm from './pages/TourForm';
import BusinessDashboard from './pages/BusinessDashboard';
import Reservations from './pages/Reservations';
import AdminDashboard from './pages/AdminDashboard';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import RestaurantsPage from './pages/RestaurantsPage';

// ✅ STRIPE IMPORTS
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// ✅ charger clé publique
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <AuthProvider>
            <div className="app-shell">
              <Navbar />

            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/business-register" element={<BusinessRegister />} />
                <Route path="/tours" element={<ToursList />} />
                <Route path="/tour/:id" element={<TourDetail />} />

                <Route path="/dashboard" element={
                  <PrivateRoute><Dashboard /></PrivateRoute>
                } />

                <Route path="/business-dashboard" element={
                  <RoleRoute roles={['BUSINESS']}><BusinessDashboard /></RoleRoute>
                } />

                <Route path="/tour-form" element={
                  <RoleRoute roles={['BUSINESS']}><TourForm /></RoleRoute>
                } />

                <Route path="/tour-form/:id" element={
                  <RoleRoute roles={['BUSINESS']}><TourForm /></RoleRoute>
                } />

                <Route path="/reservations" element={
                  <RoleRoute roles={['BUSINESS']}><Reservations /></RoleRoute>
                } />

                <Route path="/admin-dashboard" element={
                  <RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>
                } />
              </Routes>
            </main>

            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </Elements>
    </ThemeProvider>
  );
}

export default App;