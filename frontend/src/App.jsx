import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a2235',
              color: '#f1f5f9',
              border: '1px solid #2a3550',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: { primary: '#2d8f54', secondary: '#f1f5f9' },
            },
            error: {
              iconTheme: { primary: '#d44d4d', secondary: '#f1f5f9' },
            },
          }}
        />

        {/* Navigation Bar */}
        <Navbar />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
