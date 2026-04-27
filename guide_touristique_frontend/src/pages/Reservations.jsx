import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from "@mui/material";
import { CheckCircle, Cancel, Person, Event, Group, BookOnline } from "@mui/icons-material";
import axiosInstance from '../api/AxiosInstance';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionDialog, setActionDialog] = useState({ open: false, reservation: null, action: null });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get('/reservations/business');
      setReservations(response.data);
    } catch (err) {
      setError('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (reservation, action) => {
    setActionDialog({ open: true, reservation, action });
    setNotes('');
  };

  const confirmAction = async () => {
    try {
      const { reservation, action } = actionDialog;
      const statusValue = action === 'confirmed' ? 'CONFIRMED' : 'REJECTED';
      
      await axiosInstance.put(`/reservations/${reservation.id}/status?status=${statusValue}`);

      setReservations(reservations.map(r =>
        r.id === reservation.id
          ? { ...r, status: statusValue }
          : r
      ));

      setActionDialog({ open: false, reservation: null, action: null });
    } catch (err) {
      alert('Failed to update reservation');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'paid': return 'info';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', minHeight: '100vh', pb: 10 }}>
      {/* Premium Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        color: 'white',
        py: 6,
        px: 2,
        mb: 6,
        boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BookOnline sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h3" fontWeight="800">Booking Management</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Review and manage your tour reservations</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'rgba(241, 245, 249, 0.8)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, py: 3 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 3 }}>Details</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 3 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 3 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 3 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background 0.2s', '&:hover': { background: 'rgba(248, 250, 252, 0.8)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="600">
                            {reservation.userId}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Customer ID
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body1" fontWeight="600">
                          Tour ID: {reservation.tourId}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                          <Event fontSize="small" />
                          <Typography variant="body2">
                            {reservation.date ? new Date(reservation.date).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                          <Group fontSize="small" />
                          <Typography variant="body2">
                            {reservation.numberOfPeople} people
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary.main" fontWeight="700">
                        ${reservation.totalPrice}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={reservation.status}
                        color={getStatusColor(reservation.status)}
                        icon={getStatusIcon(reservation.status)}
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>
                      {reservation.status === 'PENDING' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleAction(reservation, 'confirmed')}
                            sx={{ borderRadius: 2, fontWeight: 600, boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)' }}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleAction(reservation, 'rejected')}
                            sx={{ borderRadius: 2, fontWeight: 600, borderWidth: 2 }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {reservations.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BookOnline sx={{ fontSize: 60, color: '#94a3b8', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" fontWeight="600">
                No Reservations Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                When customers book your tours, they will appear here.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Action Confirmation Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onClose={() => setActionDialog({ open: false, reservation: null, action: null })} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: actionDialog.action === 'confirmed' ? '#166534' : '#991b1b' }}>
          {actionDialog.action === 'confirmed' ? 'Confirm Reservation' : 'Reject Reservation'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontSize: '1.1rem' }}>
            Are you sure you want to <strong>{actionDialog.action}</strong> this reservation?
          </Typography>

          {actionDialog.action === 'rejected' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason for rejection (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide a reason..."
              sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setActionDialog({ open: false, reservation: null, action: null })} sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color={actionDialog.action === 'confirmed' ? 'success' : 'error'}
            sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
          >
            {actionDialog.action === 'confirmed' ? 'Confirm' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reservations;