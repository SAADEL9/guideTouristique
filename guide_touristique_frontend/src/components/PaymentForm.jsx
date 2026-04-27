import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';

const PaymentForm = ({ tourId, amount, tourTitle, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cardholderName, setCardholderName] = useState('');

  // 🔥 IMPORTANT: récupérer token ici (PAS via props)
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!stripe || !elements) {
      const message = 'Stripe is not loaded yet. Please wait a moment.';
      setError(message);
      if (onError) onError(message);
      return;
    }

    if (!token) {
      setError('User not authenticated ❌');
      return;
    }

    if (!cardholderName.trim()) {
      setError('Enter cardholder name');
      return;
    }

    setLoading(true);

    try {
      // ✅ STEP 1: create reservation + paymentIntent
      const res = await axios.post(
        'http://localhost:8080/api/reservations',
        {
          tourId: tourId,
          numberOfPeople: 1 // ⚠️ IMPORTANT (fix temporaire)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const clientSecret = res.data.clientSecret;

      // ✅ STEP 2: Stripe payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: cardholderName
            }
          }
        });

      if (stripeError) {
        setError(stripeError.message);
        if (onError) onError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess(paymentIntent);
        }, 1400);
      }

    } catch (err) {
      console.error("ERROR:", err);
      const message = err.response?.status === 401
        ? "Unauthorized ❌ Please login again"
        : err.response?.data || 'Payment failed';
      setError(message);
      if (onError) onError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card sx={{ mt: 2, p: 4, textAlign: 'center', bgcolor: 'secondary.light', borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🎉 Payment Successful
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your booking is confirmed. Thank you for choosing SMIA.
          </Typography>
          <Button variant="contained" size="large" onClick={() => onSuccess && onSuccess()}>
            Return to tours
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 2, borderRadius: 4, boxShadow: 5 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Payment</Typography>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Tour
              </Typography>
              <Typography>{tourTitle}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Amount
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>${(amount / 100).toFixed(2)}</Typography>
            </Box>

            <TextField
              fullWidth
              label="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />

            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <CardElement />
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay now'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;