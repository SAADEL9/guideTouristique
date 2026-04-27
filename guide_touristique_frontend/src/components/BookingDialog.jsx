import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

// ✅ Stripe chargé une seule fois (BONNE PRATIQUE)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const BookingDialog = ({ open, tour, onClose }) => {
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    participants: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: name === 'participants' ? parseInt(value) : value
    });
  };

  const totalPrice = tour ? tour.price * bookingData.participants : 0;

  const handleNextStep = () => {
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.date) {
      setFormError('Please fill in all required fields before continuing.');
      return;
    }

    setFormError('');
    setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setPaymentError('');
    setBookingData({
      name: '',
      email: '',
      phone: '',
      date: '',
      participants: 1
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {step === 1 ? 'Book Tour' : 'Payment'}
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={step - 1} alternativeLabel>
            <Step>
              <StepLabel>Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Payment</StepLabel>
            </Step>
          </Stepper>
        </Box>

        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        {step === 1 ? (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>{tour?.title}</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Complete your booking details and confirm the total price below.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" name="name" value={bookingData.name} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" name="email" value={bookingData.email} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" name="phone" value={bookingData.phone} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="participants"
                  value={bookingData.participants}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                  label="Participants"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 6, bgcolor: 'background.paper', height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Booking Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ mb: 1 }}>
                      {bookingData.participants} guest{bookingData.participants > 1 ? 's' : ''}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      Date: {bookingData.date || 'Choose a date'}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, mt: 2 }}>
                      Total: ${totalPrice.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Pay securely with Stripe and confirm your reservation in one click.
            </Typography>

            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 6, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Booking details
                </Typography>
                <Typography sx={{ mb: 0.5 }}>
                  Tour: {tour?.title}
                </Typography>
                <Typography sx={{ mb: 0.5 }}>
                  Guests: {bookingData.participants}
                </Typography>
                <Typography sx={{ mb: 0.5 }}>
                  Date: {bookingData.date}
                </Typography>
                <Typography sx={{ mt: 2, fontWeight: 700 }}>
                  Total: ${totalPrice.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>

            <Elements stripe={stripePromise}>
              <PaymentForm
                tourId={tour.id}
                amount={totalPrice * 100}
                tourTitle={tour.title}
                onSuccess={handleClose}
                onError={(message) => setPaymentError(message)}
              />
            </Elements>

            {paymentError && <Alert severity="error" sx={{ mt: 2 }}>{paymentError}</Alert>}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={step === 1 ? handleClose : () => setStep(1)}>
          {step === 1 ? 'Cancel' : 'Back to details'}
        </Button>

        {step === 1 && (
          <Button variant="contained" onClick={handleNextStep}>
            Continue to payment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;