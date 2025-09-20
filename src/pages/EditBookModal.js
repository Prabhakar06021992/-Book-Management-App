// EditBookModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
} from '@mui/material';
import { editBook } from '../services/Api';

const genres = ['Fiction', 'Science', 'History', 'Biography', 'Fantasy'];
const statuses = ['Available', 'Issued'];

function EditBookModal({ open, onClose, book, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    status: 'Available',
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        year: book.year || '',
        status: book.status || 'Available',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedData = { ...book, ...formData };
      await editBook(book.id, updatedData);
      onSuccess(updatedData); // Call Dashboard to update and show success toast
    } catch (error) {
      console.error('Failed to update book:', error);
      onError(); // Call Dashboard to show error toast
    }
  };

  if (!book) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          margin: '100px auto',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Book
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Published Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default EditBookModal;
