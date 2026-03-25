import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { destinationsAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiCalendar, FiUsers, FiPhone, FiMessageSquare, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    travelDate: '',
    numberOfPeople: 1,
    contactPhone: '',
    specialRequests: ''
  });

  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(p);

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchDestination = async () => {
      try {
        const { data } = await destinationsAPI.getById(id);
        setDestination(data.data);
      } catch (err) {
        toast.error('Destination not found');
        navigate('/destinations');
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id, user]);

  const totalPrice = destination ? destination.price * form.numberOfPeople : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.travelDate || !form.contactPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (form.numberOfPeople < 1 || form.numberOfPeople > (destination?.maxGroupSize || 15)) {
      toast.error(`Number of people must be between 1 and ${destination?.maxGroupSize || 15}`);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await bookingsAPI.create({
        destinationId: id,
        travelDate: form.travelDate,
        numberOfPeople: form.numberOfPeople,
        contactPhone: form.contactPhone,
        specialRequests: form.specialRequests
      });
      setSuccess(data.data);
      toast.success('Booking confirmed! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh' }}>
        <div className="loader" style={{ minHeight: '60vh' }}><div className="spinner" /></div>
      </div>
    );
  }

  // Success State
  if (success) {
    return (
      <div style={styles.page}>
        <div className="container">
          <div style={styles.successCard} className="scale-in">
            <div style={styles.successIcon}>✅</div>
            <h1 style={styles.successTitle}>Booking Confirmed!</h1>
            <p style={styles.successSubtitle}>
              Your trip to <strong>{destination?.name}</strong> has been booked successfully.
            </p>

            <div style={styles.summaryCard}>
              <div style={styles.summaryRow}>
                <span>Destination</span>
                <strong>{destination?.name}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Travel Date</span>
                <strong>{new Date(success.travelDate).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Travellers</span>
                <strong>{success.numberOfPeople} {success.numberOfPeople === 1 ? 'person' : 'people'}</strong>
              </div>
              <div style={{ ...styles.summaryRow, borderTop: '2px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total Paid</span>
                <strong style={{ color: 'var(--primary-light)', fontSize: '1.25rem' }}>
                  ₹{formatPrice(success.totalPrice)}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/my-bookings" className="btn btn-gold">View My Bookings</Link>
              <Link to="/destinations" className="btn btn-outline">Explore More</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.title}>Book Your Trip</h1>

        <div style={styles.layout}>
          {/* Booking Form */}
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Trip Details</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label"><FiCalendar style={{ marginRight: 4 }} /> Travel Date *</label>
                <input
                  type="date"
                  className="form-input"
                  min={minDate}
                  value={form.travelDate}
                  onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label"><FiUsers style={{ marginRight: 4 }} /> Number of People *</label>
                <input
                  type="number"
                  className="form-input"
                  min={1}
                  max={destination?.maxGroupSize || 15}
                  value={form.numberOfPeople}
                  onChange={(e) => setForm({ ...form, numberOfPeople: parseInt(e.target.value) || 1 })}
                  required
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Max {destination?.maxGroupSize || 15} people per booking
                </span>
              </div>

              <div className="form-group">
                <label className="form-label"><FiPhone style={{ marginRight: 4 }} /> Contact Phone *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label"><FiMessageSquare style={{ marginRight: 4 }} /> Special Requests</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Any dietary requirements, accessibility needs, or preferences?"
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-gold btn-block btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Confirming Booking...' : `Confirm Booking — ₹${formatPrice(totalPrice)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={styles.summarySection}>
            <div style={styles.destPreview}>
              <img
                src={destination?.images?.[0]}
                alt={destination?.name}
                style={styles.destImage}
              />
              <div style={styles.destInfo}>
                <h3 style={styles.destName}>{destination?.name}</h3>
                <div style={styles.destLocation}>
                  <FiMapPin size={14} color="var(--secondary)" />
                  <span>{destination?.location}</span>
                </div>
                <span style={styles.destDuration}>{destination?.duration}</span>
              </div>
            </div>

            <div style={styles.priceSummary}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Price Summary
              </h3>
              <div style={styles.priceRow}>
                <span>₹{formatPrice(destination?.price)} × {form.numberOfPeople} {form.numberOfPeople === 1 ? 'person' : 'people'}</span>
                <span>₹{formatPrice(totalPrice)}</span>
              </div>
              {destination?.originalPrice > destination?.price && (
                <div style={{ ...styles.priceRow, color: 'var(--primary-light)' }}>
                  <span>Discount savings</span>
                  <span>-₹{formatPrice((destination.originalPrice - destination.price) * form.numberOfPeople)}</span>
                </div>
              )}
              <div style={styles.totalRow}>
                <span>Total</span>
                <span>₹{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div style={styles.guarantees}>
              <div style={styles.guaranteeItem}><FiCheck color="var(--primary-light)" /> Free cancellation</div>
              <div style={styles.guaranteeItem}><FiCheck color="var(--primary-light)" /> Instant confirmation</div>
              <div style={styles.guaranteeItem}><FiCheck color="var(--primary-light)" /> Best price guarantee</div>
            </div>
          </div>
        </div>
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
    marginBottom: '2rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    alignItems: 'start',
  },
  formCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
  },
  formTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '1.5rem',
  },
  summarySection: {
    position: 'sticky',
    top: 'calc(var(--navbar-height) + 1rem)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  destPreview: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  destImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  destInfo: {
    padding: '1.25rem',
  },
  destName: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '0.35rem',
  },
  destLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    marginBottom: '0.35rem',
  },
  destDuration: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  priceSummary: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--primary-light)',
    paddingTop: '1rem',
    borderTop: '2px solid var(--border)',
    marginTop: '0.5rem',
  },
  guarantees: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  guaranteeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },

  // Success state
  successCard: {
    maxWidth: '550px',
    margin: '0 auto',
    textAlign: 'center',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '3rem',
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  successTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  successSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  summaryCard: {
    background: 'var(--bg-elevated)',
    borderRadius: 'var(--radius-md)',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'left',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
};

export default BookingPage;
