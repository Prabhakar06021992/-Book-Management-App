
import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  TablePagination,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from '@mui/material';
import { getBooks, deleteBook } from '../services/Api';
import EditBookModal from './EditBookModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); // New loading state

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const genres = ['Fiction', 'Science', 'History', 'Biography', 'Fantasy'];
  const statuses = ['Available', 'Issued'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true); // Set loading to true when fetching
      const fetchedBooks = await getBooks();
      setBooks(fetchedBooks);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const filteredBooks = books.filter((book) => {
    const lowerSearch = searchTerm.toLowerCase();
    const titleMatch = book.title?.toLowerCase().includes(lowerSearch);
    const authorMatch = book.author?.toLowerCase().includes(lowerSearch);
    const genreMatch = genreFilter ? book.genre === genreFilter : true;
    const statusMatch = statusFilter ? book.status === statusFilter : true;

    return (titleMatch || authorMatch) && genreMatch && statusMatch;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const booksToDisplay = filteredBooks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setOpenDeleteModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedBook(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedBook(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBook(selectedBook.id);
      setBooks((prev) => prev.filter((book) => book.id !== selectedBook.id));
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error('Failed to delete book');
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleEditSuccess = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    toast.success('Book updated successfully');
    handleCloseEditModal();
  };

  const handleEditError = () => {
    toast.error('Failed to update book');
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={1000} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Book List
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          label="Search by Title or Author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2, width: '300px' }}
        />
        <FormControl size="small" sx={{ mr: 2, width: '150px' }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            label="Genre"
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ width: '150px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Author</strong></TableCell>
              <TableCell><strong>Genre</strong></TableCell>
              <TableCell><strong>Year</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loader when loading state is true
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="100%" height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="100%" height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="100%" height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="100%" height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="100%" height={20} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="rectangular" width={60} height={30} />
                  </TableCell>
                </TableRow>
              ))
            ) : booksToDisplay.length > 0 ? (
              booksToDisplay.map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.year}</TableCell>
                  <TableCell>{book.status}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEditClick(book)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(book)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredBooks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modals */}
      {selectedBook && (
        <>
          <EditBookModal
            open={openEditModal}
            onClose={handleCloseEditModal}
            book={selectedBook}
            onSuccess={handleEditSuccess}
            onError={handleEditError}
          />
          <DeleteConfirmationModal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            book={selectedBook}
          />
        </>
      )}
    </Box>
  );
}

export default Dashboard;



/* import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  TablePagination,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getBooks, deleteBook } from '../services/Api';
import EditBookModal from './EditBookModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const genres = ['Fiction', 'Science', 'History', 'Biography', 'Fantasy'];
  const statuses = ['Available', 'Issued'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const fetchedBooks = await getBooks();
      setBooks(fetchedBooks);
    } catch (error) {
      toast.error('Failed to fetch books');
    }
  };

  const filteredBooks = books.filter((book) => {
    const lowerSearch = searchTerm.toLowerCase();
    const titleMatch = book.title?.toLowerCase().includes(lowerSearch);
    const authorMatch = book.author?.toLowerCase().includes(lowerSearch);
    const genreMatch = genreFilter ? book.genre === genreFilter : true;
    const statusMatch = statusFilter ? book.status === statusFilter : true;

    return (titleMatch || authorMatch) && genreMatch && statusMatch;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const booksToDisplay = filteredBooks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setOpenDeleteModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedBook(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedBook(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBook(selectedBook.id);
      setBooks((prev) => prev.filter((book) => book.id !== selectedBook.id));
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error('Failed to delete book');
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleEditSuccess = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    toast.success('Book updated successfully');
    handleCloseEditModal();
  };

  const handleEditError = () => {
    toast.error('Failed to update book');
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={1000} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Book List
      </Typography>

  
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          label="Search by Title or Author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2, width: '300px' }}
        />
        <FormControl size="small" sx={{ mr: 2, width: '150px' }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            label="Genre"
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ width: '150px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Author</strong></TableCell>
              <TableCell><strong>Genre</strong></TableCell>
              <TableCell><strong>Year</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {booksToDisplay.length > 0 ? (
              booksToDisplay.map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.year}</TableCell>
                  <TableCell>{book.status}</TableCell>
                  <TableCell align="center">
                    <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditClick(book)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(book)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredBooks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

     
      {selectedBook && (
        <>
          <EditBookModal
            open={openEditModal}
            onClose={handleCloseEditModal}
            book={selectedBook}
            onSuccess={handleEditSuccess}
            onError={handleEditError}
          />
          <DeleteConfirmationModal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            book={selectedBook}
          />
        </>
      )}
    </Box>
  );
}

export default Dashboard; 

 */
