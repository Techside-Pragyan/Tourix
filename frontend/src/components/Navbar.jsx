import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiUser, FiLogOut, FiCalendar, FiMenu, FiX } from 'react-icons/fi';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if we're on the home page for transparent navbar
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setDropdownOpen(false);
    if (dropdownOpen) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [dropdownOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'scrolled' : 'transparent'}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌴</span>
          <span>Tourix</span>
        </Link>

        {/* Navigation Links */}
        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/destinations" className={`navbar-link ${location.pathname.startsWith('/destinations') ? 'active' : ''}`}>
            Destinations
          </Link>
          {user && (
            <Link to="/my-bookings" className={`navbar-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>
              My Bookings
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <span className="navbar-user-name">Hi, {user.name.split(' ')[0]}</span>
              <div
                className="navbar-user-avatar"
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="navbar-dropdown" onClick={(e) => e.stopPropagation()}>
                  <Link to="/my-bookings" className="navbar-dropdown-item">
                    <FiCalendar /> My Bookings
                  </Link>
                  <div className="navbar-dropdown-divider" />
                  <div className="navbar-dropdown-item" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
