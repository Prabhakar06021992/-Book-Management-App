import axios from 'axios';

const apiUrl = 'http://localhost:5000/books';

// Get all books
export const getBooks = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

// Add a new book
export const addBook = async (bookData) => {
  try {
    const response = await axios.post(apiUrl, bookData);
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// Edit an existing book
export const editBook = async (id, bookData) => {
  try {
    const response = await axios.put(`${apiUrl}/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error editing book:', error);
    throw error;
  }
};

// Delete a book
export const deleteBook = async (id) => {
  try {
    await axios.delete(`${apiUrl}/${id}`);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
