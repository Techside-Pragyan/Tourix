import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(p);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchBookings = async () => {
      try {
        const { data } = await bookingsAPI.getMyBookings();
        setBookings(data.data);
      } catch (err) {
        console.error('Error loading bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(bookingId);
      setBookings(bookings.map(b =>
        b._id === bookingId ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b
      ));
      toast.success('Booking cancelled & refund initiated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return { background: 'rgba(26, 107, 60, 0.2)', color: '#2d8f54', borderColor: 'rgba(26, 107, 60, 0.3)' };
      case 'pending': return { background: 'rgba(200, 134, 10, 0.2)', color: '#e6a520', borderColor: 'rgba(200, 134, 10, 0.3)' };
      case 'cancelled': return { background: 'rgba(184, 51, 51, 0.2)', color: '#d44d4d', borderColor: 'rgba(184, 51, 51, 0.3)' };
      case 'completed': return { background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', borderColor: 'rgba(14, 165, 233, 0.3)' };
      default: return {};
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh' }}>
        <div className="loader" style={{ minHeight: '60vh' }}><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.title}>My Bookings</h1>
        <p style={styles.subtitle}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>

        {bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '4rem' }}>🗺️</span>
            <h2 style={{ color: 'var(--text-primary)', marginTop: '1rem' }}>No bookings yet</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>
              Start exploring and book your first South India adventure!
            </p>
            <Link to="/destinations" className="btn btn-gold">Browse Destinations</Link>
          </div>
        ) : (
          <div style={styles.bookingsGrid}>
            {bookings.map((booking) => (
              <div key={booking._id} style={styles.bookingCard}>
                {/* Destination Image */}
                <div style={styles.cardImage}>
                  <img
                    src={booking.destination?.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
                    alt={booking.destination?.name}
                    style={styles.image}
                  />
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(booking.status) }}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.destName}>
                    <Link to={`/destinations/${booking.destination?._id}`} style={{ color: 'inherit' }}>
                      {booking.destination?.name || 'Unknown Destination'}
                    </Link>
                  </h3>

                  <div style={styles.cardMeta}>
                    <div style={styles.metaItem}>
                      <FiMapPin size={14} color="var(--secondary)" />
                      <span>{booking.destination?.location || ''}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <FiCalendar size={14} />
                      <span>{new Date(booking.travelDate).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <FiUsers size={14} />
                      <span>{booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <FiClock size={14} />
                      <span>{booking.destination?.duration}</span>
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <div>
                      <span style={styles.totalLabel}>Total Paid</span>
                      <span style={styles.totalPrice}>₹{formatPrice(booking.totalPrice)}</span>
                    </div>
                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <FiX size={14} /> Cancel
                      </button>
                    )}
                  </div>

                  <div style={styles.bookedOn}>
                    Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    paddingTop: 'calc(var(--navbar-height) + 2rem)',
    paddingBottom: '4rem',
    minHeight: '100vh',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '5rem 2rem',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border)',
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '1.5rem',
  },
  bookingCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    transition: 'all 0.3s',
  },
  cardImage: {
    position: 'relative',
    height: '180px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '0.3rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: 600,
    border: '1px solid',
  },
  cardContent: {
    padding: '1.25rem',
  },
  destName: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  cardMeta: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem 1rem',
    marginBottom: '1rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border)',
  },
  totalLabel: {
    display: 'block',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  totalPrice: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--primary-light)',
  },
  bookedOn: {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    marginTop: '0.75rem',
  },
};

export default MyBookingsPage;
