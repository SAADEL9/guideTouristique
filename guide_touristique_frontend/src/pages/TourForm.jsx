import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';
import {
  Container, Typography, Box, TextField, Button, Card, CardContent,
  Grid, Chip, IconButton, Alert, CircularProgress
} from "@mui/material";
import { Add, Delete, CloudUpload } from "@mui/icons-material";

const TourForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    maxGroupSize: '',
    meetingPoint: '',
    activities: [],
    availableDates: [],
    languages: [],
    included: [],
    notIncluded: [],
    images: []
  });

  const [currents, setCurrents] = useState({
    activity: '',
    date: '',
    language: '',
    included: '',
    notIncluded: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrentChange = (e) => {
    setCurrents({ ...currents, [e.target.name]: e.target.value });
  };

  const addToList = (field, currentField) => {
    if (currents[currentField].trim()) {
      setFormData({ ...formData, [field]: [...formData[field], currents[currentField].trim()] });
      setCurrents({ ...currents, [currentField]: '' });
    }
  };

  const removeFromList = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Convert files to base64 strings so backend can accept them as List<String>
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    })).then(base64Images => {
      setFormData({ ...formData, images: [...formData.images, ...base64Images] });
    });
  };

  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.price || !formData.duration || !formData.maxGroupSize) {
      setError('Please fill in all required basic fields');
      return;
    }

    setLoading(true);
    try {
      const tourData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration, 10),
        maxGroupSize: parseInt(formData.maxGroupSize, 10),
        meetingPoint: formData.meetingPoint,
        activities: formData.activities,
        availableDates: formData.availableDates,
        languages: formData.languages,
        included: formData.included,
        notIncluded: formData.notIncluded,
        images: formData.images
      };

      await axiosInstance.post('/tours', tourData);

      setSuccess('Tour created! Pending admin approval.');
      setTimeout(() => navigate('/business-dashboard'), 2000);
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error || err.response?.data || 'Failed to create tour';
      setError(typeof backendMessage === 'string' ? backendMessage : JSON.stringify(backendMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Create New Tour</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card sx={{ boxShadow: 6, borderRadius: 4 }}>
        <CardContent sx={{ p: 0 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3, p: 4 }}>

            {/* Basic Info */}
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Basic Info</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField required fullWidth label="Tour Title" name="title" value={formData.title} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField required fullWidth label="Meeting Point" name="meetingPoint" value={formData.meetingPoint} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField required fullWidth label="Price per Person ($)" name="price" type="number" value={formData.price} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField required fullWidth label="Duration (days)" name="duration" type="number" value={formData.duration} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField required fullWidth label="Max Group Size" name="maxGroupSize" type="number" value={formData.maxGroupSize} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required fullWidth multiline rows={4} label="Description" name="description" value={formData.description} onChange={handleChange} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Lists Section */}
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Tour Details</Typography>
                <Grid container spacing={3}>
                  
                  {/* Activities */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Activities</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField fullWidth size="small" label="Add Activity" name="activity" value={currents.activity}
                        onChange={handleCurrentChange}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('activities', 'activity'))} />
                      <Button variant="contained" onClick={() => addToList('activities', 'activity')} sx={{ minWidth: 40 }}><Add /></Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.activities.map((item, index) => (
                        <Chip key={index} label={item} onDelete={() => removeFromList('activities', index)} color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>

                  {/* Available Dates */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Available Dates</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField fullWidth size="small" type="date" name="date" value={currents.date}
                        onChange={handleCurrentChange}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('availableDates', 'date'))} />
                      <Button variant="contained" onClick={() => addToList('availableDates', 'date')} sx={{ minWidth: 40 }}><Add /></Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.availableDates.map((item, index) => (
                        <Chip key={index} label={item} onDelete={() => removeFromList('availableDates', index)} color="secondary" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>

                  {/* Languages */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Languages</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField fullWidth size="small" label="Add Language" name="language" value={currents.language}
                        onChange={handleCurrentChange}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('languages', 'language'))} />
                      <Button variant="contained" onClick={() => addToList('languages', 'language')} sx={{ minWidth: 40 }}><Add /></Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.languages.map((item, index) => (
                        <Chip key={index} label={item} onDelete={() => removeFromList('languages', index)} color="info" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>

                  {/* Included */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Included</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField fullWidth size="small" label="Add Included" name="included" value={currents.included}
                        onChange={handleCurrentChange}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('included', 'included'))} />
                      <Button variant="contained" onClick={() => addToList('included', 'included')} sx={{ minWidth: 40 }}><Add /></Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.included.map((item, index) => (
                        <Chip key={index} label={item} onDelete={() => removeFromList('included', index)} color="success" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>

                  {/* Not Included */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Not Included</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField fullWidth size="small" label="Add Not Included" name="notIncluded" value={currents.notIncluded}
                        onChange={handleCurrentChange}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('notIncluded', 'notIncluded'))} />
                      <Button variant="contained" onClick={() => addToList('notIncluded', 'notIncluded')} sx={{ minWidth: 40 }}><Add /></Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.notIncluded.map((item, index) => (
                        <Chip key={index} label={item} onDelete={() => removeFromList('notIncluded', index)} color="error" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>

                </Grid>
              </CardContent>
            </Card>

            {/* Media */}
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Media</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload high quality photos to showcase your tour.
                </Typography>
                <Button variant="outlined" component="label" startIcon={<CloudUpload />} sx={{ mb: 2 }}>
                  Upload Images
                  <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                </Button>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.images.map((base64, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <img src={base64} alt={`Upload ${index + 1}`}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12 }} />
                      <IconButton onClick={() => removeImage(index)}
                        sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'rgba(255,255,255,0.9)' }} size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ py: 1.8 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'CREATE TOUR'}
            </Button>

          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TourForm;