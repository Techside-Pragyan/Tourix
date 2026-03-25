import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiClock } from 'react-icons/fi';

const DestinationCard = ({ destination }) => {
  const { _id, name, location, images, price, originalPrice, category, rating, totalReviews, duration, shortDescription } = destination;

  // Format price in INR
  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(p);

  // Calculate discount percentage
  const discount = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <Link to={`/destinations/${_id}`} style={styles.card}>
      {/* Image Section */}
      <div style={styles.imageWrapper}>
        <img
          src={images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
          alt={name}
          style={styles.image}
          loading="lazy"
        />
        <div style={styles.imageOverlay} />
        
        {/* Category Badge */}
        <span style={styles.categoryBadge}>{category}</span>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <span style={styles.discountBadge}>{discount}% OFF</span>
        )}
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.name}>{name}</h3>
          <div style={styles.locationRow}>
            <FiMapPin size={14} color="var(--secondary)" />
            <span style={styles.locationText}>{location}</span>
          </div>
        </div>

        <p style={styles.description}>{shortDescription}</p>

        {/* Meta Row */}
        <div style={styles.metaRow}>
          <div style={styles.rating}>
            <FiStar size={14} fill="var(--secondary)" color="var(--secondary)" />
            <span style={styles.ratingValue}>{rating?.toFixed(1) || '0.0'}</span>
            <span style={styles.reviewCount}>({totalReviews || 0})</span>
          </div>
          <div style={styles.duration}>
            <FiClock size={13} color="var(--text-muted)" />
            <span style={styles.durationText}>{duration}</span>
          </div>
        </div>

        {/* Price Row */}
        <div style={styles.priceRow}>
          <div style={styles.priceGroup}>
            <span style={styles.price}>₹{formatPrice(price)}</span>
            {originalPrice > price && (
              <span style={styles.originalPrice}>₹{formatPrice(originalPrice)}</span>
            )}
            <span style={styles.perPerson}>/person</span>
          </div>
          <span style={styles.exploreBtn}>Explore →</span>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  },
  imageWrapper: {
    position: 'relative',
    height: '220px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '0.3rem 0.8rem',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(26, 107, 60, 0.85)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
  },
  discountBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '0.3rem 0.8rem',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(184, 51, 51, 0.9)',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  content: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: 'var(--text-primary)',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  locationText: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '0.88rem',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  ratingValue: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--secondary-light)',
  },
  reviewCount: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  duration: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  durationText: {
    color: 'var(--text-muted)',
    fontSize: '0.82rem',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border)',
    marginTop: 'auto',
  },
  priceGroup: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  price: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--primary-light)',
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  perPerson: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  exploreBtn: {
    color: 'var(--secondary)',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
};

export default DestinationCard;
