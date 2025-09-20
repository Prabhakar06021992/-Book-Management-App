import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import AddBook from './pages/AddBook';
function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        {/* MUI AppBar */}
        <AppBar position="static" color="primary">
          <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left Side: Navigation Links */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/add">
                Add Book
              </Button>
            </Box>

            {/* Right Side: Book Manager Title */}
            
            <Typography variant="h6" component="div" >
              Book Manager
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddBook />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;

