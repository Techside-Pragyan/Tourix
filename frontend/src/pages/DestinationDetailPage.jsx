import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationsAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FiMapPin, FiStar, FiClock, FiUsers, FiCalendar, FiCheck, FiChevronLeft, FiChevronRight, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DestinationDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(p);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [destRes, revRes] = await Promise.all([
          destinationsAPI.getById(id),
          reviewsAPI.getByDestination(id)
        ]);
        setDestination(destRes.data.data);
        setReviews(revRes.data.data);
      } catch (err) {
        console.error('Error loading destination:', err);
        toast.error('Destination not found');
        navigate('/destinations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to write a review');
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await reviewsAPI.create(id, reviewForm);
      setReviews([data.data, ...reviews]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
      // Refresh destination to get updated rating
      const destRes = await destinationsAPI.getById(id);
      setDestination(destRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewsAPI.delete(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
      const destRes = await destinationsAPI.getById(id);
      setDestination(destRes.data.data);
    } catch (err) {
      toast.error('Could not delete review');
    }
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % destination.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + destination.images.length) % destination.images.length);

  if (loading) {
    return (
      <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh' }}>
        <div className="loader" style={{ minHeight: '60vh' }}><div className="spinner" /></div>
      </div>
    );
  }

  if (!destination) return null;

  const discount = destination.originalPrice > destination.price
    ? Math.round(((destination.originalPrice - destination.price) / destination.originalPrice) * 100)
    : 0;

  return (
    <div style={styles.page}>
      {/* Image Gallery */}
      <div style={styles.gallery}>
        <div style={styles.mainImageWrapper}>
          <img
            src={destination.images[activeImage]}
            alt={destination.name}
            style={styles.mainImage}
          />
          <div style={styles.galleryOverlay} />
          {destination.images.length > 1 && (
            <>
              <button style={{ ...styles.galleryBtn, left: '1rem' }} onClick={prevImage}><FiChevronLeft size={24} /></button>
              <button style={{ ...styles.galleryBtn, right: '1rem' }} onClick={nextImage}><FiChevronRight size={24} /></button>
            </>
          )}
          <div style={styles.galleryCounter}>
            {activeImage + 1} / {destination.images.length}
          </div>
        </div>
        {/* Thumbnails */}
        <div style={styles.thumbnails}>
          {destination.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${destination.name} ${i + 1}`}
              style={{
                ...styles.thumbnail,
                ...(i === activeImage ? styles.thumbnailActive : {})
              }}
              onClick={() => setActiveImage(i)}
            />
          ))}
        </div>
      </div>

      <div className="container">
        <div style={styles.content}>
          {/* Main Content */}
          <div style={styles.mainContent}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.badges}>
                <span className="badge badge-primary">{destination.category}</span>
                <span className="badge badge-gold">{destination.state}</span>
                {discount > 0 && <span className="badge badge-danger">{discount}% OFF</span>}
              </div>
              <h1 style={styles.name}>{destination.name}</h1>
              <div style={styles.meta}>
                <span style={styles.metaItem}><FiMapPin size={16} color="var(--secondary)" /> {destination.location}</span>
                <span style={styles.metaItem}><FiClock size={16} /> {destination.duration}</span>
                <span style={styles.metaItem}><FiUsers size={16} /> Max {destination.maxGroupSize} people</span>
                <span style={styles.metaItem}><FiCalendar size={16} /> Best: {destination.bestTimeToVisit}</span>
              </div>
              <div style={styles.ratingRow}>
                <FiStar size={18} fill="var(--secondary)" color="var(--secondary)" />
                <span style={styles.ratingValue}>{destination.rating?.toFixed(1)}</span>
                <span style={styles.ratingCount}>({destination.totalReviews} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>About This Destination</h2>
              <p style={styles.description}>{destination.description}</p>
            </div>

            {/* Highlights */}
            {destination.highlights?.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Trip Highlights</h2>
                <div style={styles.highlightGrid}>
                  {destination.highlights.map((h, i) => (
                    <div key={i} style={styles.highlightItem}>
                      <FiCheck size={16} color="var(--primary-light)" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            {destination.included?.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>What's Included</h2>
                <div style={styles.includedGrid}>
                  {destination.included.map((item, i) => (
                    <div key={i} style={styles.includedItem}>
                      <span style={styles.includedIcon}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {destination.coordinates && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Location</h2>
                <div style={styles.mapWrapper}>
                  <MapContainer
                    center={[destination.coordinates.lat, destination.coordinates.lng]}
                    zoom={10}
                    style={{ height: '350px', width: '100%', borderRadius: '12px' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={[destination.coordinates.lat, destination.coordinates.lng]}>
                      <Popup>{destination.name}, {destination.location}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Reviews ({reviews.length})
              </h2>

              {/* Review Form */}
              {user ? (
                <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Write a Review</h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 auto' }}>
                      <label className="form-label">Rating</label>
                      <select
                        className="form-select"
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                        style={{ width: '100px' }}
                      >
                        {[5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>{'⭐'.repeat(r)}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label className="form-label">Title</label>
                      <input
                        className="form-input"
                        placeholder="Summarize your experience"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Tell others about your experience..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ marginTop: '1rem' }}
                  >
                    {submitting ? 'Submitting...' : <><FiSend size={16} /> Submit Review</>}
                  </button>
                </form>
              ) : (
                <div style={styles.loginPrompt}>
                  <Link to="/login" className="btn btn-outline">Log in to write a review</Link>
                </div>
              )}

              {/* Reviews List */}
              <div style={styles.reviewsList}>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.reviewAvatar}>
                          {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div style={styles.reviewAuthor}>{review.user?.name || 'Anonymous'}</div>
                          <div style={styles.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div style={styles.reviewRating}>
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                      <h4 style={styles.reviewTitle}>{review.title}</h4>
                      <p style={styles.reviewComment}>{review.comment}</p>
                      {user && review.user?._id === user._id && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          style={styles.deleteReviewBtn}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside style={styles.bookingSidebar}>
            <div style={styles.bookingCard}>
              <div style={styles.priceBlock}>
                <div style={styles.price}>₹{formatPrice(destination.price)}</div>
                {destination.originalPrice > destination.price && (
                  <span style={styles.originalPrice}>₹{formatPrice(destination.originalPrice)}</span>
                )}
                <span style={styles.perPerson}>/ person</span>
              </div>

              {discount > 0 && (
                <div style={styles.savingsTag}>
                  You save ₹{formatPrice(destination.originalPrice - destination.price)} per person!
                </div>
              )}

              <div style={styles.bookingInfo}>
                <div style={styles.bookingInfoRow}>
                  <FiClock size={16} /> <span>{destination.duration}</span>
                </div>
                <div style={styles.bookingInfoRow}>
                  <FiUsers size={16} /> <span>Up to {destination.maxGroupSize} people</span>
                </div>
                <div style={styles.bookingInfoRow}>
                  <FiCalendar size={16} /> <span>{destination.bestTimeToVisit}</span>
                </div>
              </div>

              <Link
                to={user ? `/book/${destination._id}` : '/login'}
                className="btn btn-gold btn-block btn-lg"
                style={{ marginTop: '1rem' }}
              >
                {user ? 'Book Now' : 'Login to Book'}
              </Link>

              <p style={styles.bookingNote}>
                ✓ Free cancellation • ✓ Instant confirmation
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    paddingTop: 'var(--navbar-height)',
    paddingBottom: '4rem',
    minHeight: '100vh',
  },
  gallery: {
    marginBottom: '2rem',
  },
  mainImageWrapper: {
    position: 'relative',
    height: '500px',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(transparent, rgba(10,14,23,0.6))',
  },
  galleryBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  galleryCounter: {
    position: 'absolute',
    bottom: '1rem',
    right: '1rem',
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '99px',
    fontSize: '0.85rem',
  },
  thumbnails: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    overflowX: 'auto',
    background: 'var(--bg-secondary)',
  },
  thumbnail: {
    width: '80px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    opacity: 0.5,
    transition: 'all 0.2s',
    border: '2px solid transparent',
    flexShrink: 0,
  },
  thumbnailActive: {
    opacity: 1,
    borderColor: 'var(--primary)',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '2rem',
    alignItems: 'start',
  },
  mainContent: {},
  header: {
    marginBottom: '2rem',
  },
  badges: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.25rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '1rem',
    lineHeight: 1.2,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.25rem',
    marginBottom: '1rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  ratingValue: {
    fontWeight: 700,
    fontSize: '1.2rem',
    color: 'var(--secondary-light)',
  },
  ratingCount: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  section: {
    marginBottom: '2.5rem',
    paddingBottom: '2.5rem',
    borderBottom: '1px solid var(--border)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '1.25rem',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    lineHeight: 1.8,
  },
  highlightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  includedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  includedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  includedIcon: {
    color: 'var(--primary-light)',
    fontWeight: 700,
  },
  mapWrapper: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--border)',
  },

  // Booking sidebar
  bookingSidebar: {
    position: 'sticky',
    top: 'calc(var(--navbar-height) + 1rem)',
  },
  bookingCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
  },
  priceBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '0.5rem',
  },
  price: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--primary-light)',
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
  perPerson: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  savingsTag: {
    background: 'rgba(26, 107, 60, 0.15)',
    color: 'var(--primary-light)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '1.5rem',
  },
  bookingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1.25rem 0',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  },
  bookingInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  bookingNote: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    marginTop: '1rem',
  },

  // Reviews
  reviewForm: {
    background: 'var(--bg-elevated)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-md)',
    marginBottom: '2rem',
    border: '1px solid var(--border)',
  },
  loginPrompt: {
    textAlign: 'center',
    padding: '1.5rem',
    background: 'var(--bg-elevated)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '1.5rem',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  reviewCard: {
    background: 'var(--bg-elevated)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  reviewAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: '1rem',
    flexShrink: 0,
  },
  reviewAuthor: {
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
  },
  reviewDate: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  reviewRating: {
    marginLeft: 'auto',
    fontSize: '0.9rem',
  },
  reviewTitle: {
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.35rem',
  },
  reviewComment: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
  },
  deleteReviewBtn: {
    marginTop: '0.75rem',
    background: 'none',
    border: 'none',
    color: 'var(--accent-light)',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
};

export default DestinationDetailPage;
