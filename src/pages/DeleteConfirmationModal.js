import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';

function DeleteConfirmationModal({ open, onClose, onConfirm, book }) {
  if (!book) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          margin: 'auto',
          padding: 2,
          backgroundColor: 'white',
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Confirm Deletion
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete the following book?
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2"><strong>Title:</strong> {book.title}</Typography>
            <Typography variant="body2"><strong>Author:</strong> {book.author}</Typography>
            <Typography variant="body2"><strong>Genre:</strong> {book.genre}</Typography>
            <Typography variant="body2"><strong>Published Year:</strong> {book.year}</Typography>
            <Typography variant="body2"><strong>Status:</strong> {book.status}</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} textAlign="right" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mr: 2 }}
            onClick={onClose} // Close the modal without deleting
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm} // Confirm deletion
          >
            Confirm
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
}

export default DeleteConfirmationModal;
