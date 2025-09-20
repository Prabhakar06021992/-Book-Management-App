import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid, // Import Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../services/Api';

const genres = ['Fiction', 'Science', 'History', 'Biography', 'Fantasy'];
const statuses = ['Available', 'Issued'];

const AddBook = () => {
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    status: 'Available',
  });

  const [openPopup, setOpenPopup] = useState(false);
  const [addedBook, setAddedBook] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBook(bookData);
      setAddedBook(bookData);
      setOpenPopup(true);
      // Reset form
      setBookData({
        title: '',
        author: '',
        genre: '',
        year: '',
        status: 'Available',
      });
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleClose = () => {
    setOpenPopup(false);
    navigate('/');
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 600,
          margin: 'auto',
          mt: 5,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add New Book
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={bookData.title}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Author"
            name="author"
            value={bookData.author}
            onChange={handleChange}
            required
            margin="normal"
          />
                <Grid container spacing={2} mt={2}> {/* Use Grid to place fields in the same row */}
        <Grid item xs={12} sm={4} sx={{flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TextField
            fullWidth
            label="Published Year"
            name="year"
            value={bookData.year}
            onChange={handleChange}
            type="number"
            inputProps={{
                min: 1000,
                max: new Date().getFullYear(),
                step: 1,
            }}
            required
            margin="normal"
            />
        </Grid>

        <Grid item xs={12} sm={4} sx={{flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TextField
            fullWidth
            select
            label="Genre"
            name="genre"
            value={bookData.genre}
            onChange={handleChange}
            required
            margin="normal"
            >
            {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                {genre}
                </MenuItem>
            ))}
            </TextField>
        </Grid>

        <Grid item xs={12} sm={4} sx={{ flex: 1 ,display: 'flex', flexDirection: 'column' }}>
            <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={bookData.status}
            onChange={handleChange}
            required
            margin="normal"
            >
            {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                {status}
                </MenuItem>
            ))}
            </TextField>
        </Grid>
        </Grid>


          <Box textAlign="right" mt={2}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#115293',
                },
              }}
            >
              Add Book
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Popup dialog */}
      <Dialog open={openPopup} onClose={handleClose}>
        <DialogTitle>Book Added Successfully!</DialogTitle>
        <DialogContent>
          <DialogContentText>The following book has been added:</DialogContentText>
          {addedBook && (
            <Box mt={2}>
              <Typography>
                <strong>Title:</strong> {addedBook.title}
              </Typography>
              <Typography>
                <strong>Author:</strong> {addedBook.author}
              </Typography>
              <Typography>
                <strong>Genre:</strong> {addedBook.genre}
              </Typography>
              <Typography>
                <strong>Published Year:</strong> {addedBook.year}
              </Typography>
              <Typography>
                <strong>Status:</strong> {addedBook.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddBook;
