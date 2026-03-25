import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { FiSearch, FiMapPin, FiStar, FiUsers, FiArrowRight, FiCompass } from 'react-icons/fi';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await destinationsAPI.getAll({ featured: true, limit: 8 });
        setFeatured(data.data);
      } catch (err) {
        console.error('Error loading featured:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const categories = [
    { name: 'Backwaters', icon: '🛶', color: '#1a6b3c' },
    { name: 'Beaches', icon: '🏖️', color: '#0891b2' },
    { name: 'Temples', icon: '🛕', color: '#c8860a' },
    { name: 'Hill Stations', icon: '⛰️', color: '#7c3aed' },
    { name: 'Heritage', icon: '🏛️', color: '#b83333' },
    { name: 'Wildlife', icon: '🐘', color: '#059669' },
  ];

  const stats = [
    { value: '28+', label: 'Destinations', icon: <FiMapPin /> },
    { value: '7', label: 'South Indian States', icon: <FiCompass /> },
    { value: '4.6', label: 'Average Rating', icon: <FiStar /> },
    { value: '10K+', label: 'Happy Travellers', icon: <FiUsers /> },
  ];

  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroPattern} />
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroBadge}>
            🌿 Explore God's Own Country & Beyond
          </div>
          <h1 style={styles.heroTitle}>
            Discover the <span style={styles.heroAccent}>Magic</span> of<br />
            South India
          </h1>
          <p style={styles.heroSubtitle}>
            From Kerala's serene backwaters to Tamil Nadu's ancient temples, Karnataka's royal heritage 
            to Goa's sun-kissed beaches — embark on a journey through India's most enchanting landscapes.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={styles.searchContainer}>
            <div style={styles.searchBar}>
              <FiSearch size={20} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search destinations... e.g., Munnar, Hampi, Gokarna"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" className="btn btn-gold" style={{ borderRadius: '10px' }}>
                Search
              </button>
            </div>
          </form>

          {/* Quick Category Links */}
          <div style={styles.quickLinks}>
            {['Kerala', 'Tamil Nadu', 'Karnataka', 'Goa'].map((state) => (
              <Link
                key={state}
                to={`/destinations?state=${encodeURIComponent(state)}`}
                style={styles.quickLink}
              >
                <FiMapPin size={14} /> {state}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={styles.scrollIndicator}>
          <div style={styles.scrollDot} />
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section style={styles.statsSection}>
        <div className="container">
          <div style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} style={styles.statCard}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Explore by Experience</h2>
            <p className="section-subtitle" style={{ textAlign: 'center' }}>
              Choose your perfect South Indian adventure
            </p>
          </div>
          <div style={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/destinations?category=${cat.name.replace('s', '').replace('e', '')}`}
                style={{ ...styles.categoryCard, '--cat-color': cat.color }}
              >
                <span style={styles.categoryIcon}>{cat.icon}</span>
                <span style={styles.categoryName}>{cat.name}</span>
                <FiArrowRight size={16} style={styles.categoryArrow} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED DESTINATIONS ========== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title">Featured Destinations</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Handpicked experiences curated by travel experts
              </p>
            </div>
            <Link to="/destinations" className="btn btn-outline">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : (
            <div style={styles.destinationGrid}>
              {featured.map((dest, i) => (
                <div key={dest._id} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <DestinationCard destination={dest} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== WHY SOUTH INDIA SECTION ========== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Why South India?</h2>
            <p className="section-subtitle" style={{ textAlign: 'center' }}>
              A land where ancient traditions meet breathtaking natural beauty
            </p>
          </div>
          <div style={styles.whyGrid}>
            {[
              { icon: '🛕', title: 'Ancient Temples', desc: 'Dravidian architecture spanning thousands of years, from Meenakshi to Hampi.' },
              { icon: '🌊', title: 'Pristine Backwaters', desc: 'Cruise through Kerala\'s 900km network of serene canals and lagoons.' },
              { icon: '🍛', title: 'Incredible Cuisine', desc: 'From Kerala Sadya to Hyderabadi Biryani — a culinary paradise.' },
              { icon: '💚', title: 'Lush Nature', desc: 'Western Ghats, tea plantations, waterfalls, and dense tropical forests.' },
              { icon: '🎭', title: 'Living Culture', desc: 'Kathakali, Bharatanatyam, Theyyam — art forms practiced for centuries.' },
              { icon: '🏖️', title: 'Golden Beaches', desc: 'From Goa\'s party shores to Gokarna\'s hidden coves and Kovalam\'s cliffs.' },
            ].map((item, i) => (
              <div key={i} style={styles.whyCard}>
                <span style={styles.whyIcon}>{item.icon}</span>
                <h3 style={styles.whyTitle}>{item.title}</h3>
                <p style={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={styles.ctaTitle}>Ready to Explore South India?</h2>
          <p style={styles.ctaSubtitle}>
            Book your dream trip today and experience the magic of India's most beautiful region.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/destinations" className="btn btn-gold btn-lg">
              Browse Destinations <FiArrowRight />
            </Link>
            <Link to="/signup" className="btn btn-outline btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Inline styles for the home page
const styles = {
  // Hero
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, #0a0e17 0%, #0d2818 50%, #0a0e17 100%)`,
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(ellipse at 20% 50%, rgba(26, 107, 60, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(200, 134, 10, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(26, 107, 60, 0.1) 0%, transparent 50%)
    `,
  },
  heroPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    paddingTop: '120px',
    paddingBottom: '60px',
  },
  heroBadge: {
    display: 'inline-flex',
    padding: '0.5rem 1.25rem',
    borderRadius: '9999px',
    background: 'rgba(26, 107, 60, 0.15)',
    border: '1px solid rgba(26, 107, 60, 0.3)',
    color: '#2d8f54',
    fontSize: '0.9rem',
    fontWeight: 500,
    marginBottom: '1.5rem',
    letterSpacing: '0.02em',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: '1.5rem',
    color: '#f1f5f9',
    letterSpacing: '-0.02em',
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #2d8f54, #e6a520)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: '#94a3b8',
    maxWidth: '700px',
    margin: '0 auto 2.5rem',
    lineHeight: 1.7,
  },
  searchContainer: {
    maxWidth: '650px',
    margin: '0 auto 2rem',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.5rem 0.5rem 1.25rem',
    background: 'rgba(26, 34, 53, 0.8)',
    border: '2px solid rgba(42, 53, 80, 0.8)',
    borderRadius: '14px',
    backdropFilter: 'blur(20px)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    color: '#f1f5f9',
    fontSize: '1rem',
    padding: '0.5rem 0',
  },
  quickLinks: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  quickLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 1rem',
    borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
    background: 'rgba(255,255,255,0.03)',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '24px',
    height: '40px',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '6px',
  },
  scrollDot: {
    width: '4px',
    height: '8px',
    borderRadius: '2px',
    background: 'var(--primary-light)',
    animation: 'slideUp 1.5s ease infinite',
  },

  // Stats
  statsSection: {
    padding: '3rem 0',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  statCard: {
    textAlign: 'center',
    padding: '1.5rem',
  },
  statIcon: {
    fontSize: '1.5rem',
    color: 'var(--primary-light)',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },

  // Categories
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '2rem 1.5rem',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  },
  categoryIcon: {
    fontSize: '2.5rem',
  },
  categoryName: {
    fontWeight: 600,
    fontSize: '1rem',
    color: 'var(--text-primary)',
  },
  categoryArrow: {
    color: 'var(--text-muted)',
    transition: 'transform 0.2s',
  },

  // Destination grid
  destinationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },

  // Why South India
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  whyCard: {
    padding: '2rem',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    transition: 'all 0.3s',
  },
  whyIcon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  whyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
  },
  whyDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: 1.7,
  },

  // CTA
  ctaSection: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '1rem',
  },
  ctaSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1.15rem',
    maxWidth: '500px',
    margin: '0 auto 2rem',
    lineHeight: 1.6,
  },
};

export default HomePage;
