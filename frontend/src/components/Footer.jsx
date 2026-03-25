import { Link } from 'react-router-dom';
import { FiMapPin, FiMail, FiPhone, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          {/* Brand Column */}
          <div style={styles.brandCol}>
            <div style={styles.logo}>
              <span style={{ fontSize: '2rem' }}>🌴</span>
              <span style={styles.logoText}>Tourix</span>
            </div>
            <p style={styles.brandDesc}>
              Discover the enchanting beauty of South India — from Kerala's backwaters
              to Tamil Nadu's temples. Your journey begins here.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialIcon}><FiInstagram size={18} /></a>
              <a href="#" style={styles.socialIcon}><FiTwitter size={18} /></a>
              <a href="#" style={styles.socialIcon}><FiFacebook size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <div style={styles.linkList}>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/destinations" style={styles.link}>Destinations</Link>
              <Link to="/destinations?category=Beach" style={styles.link}>Beaches</Link>
              <Link to="/destinations?category=Heritage" style={styles.link}>Heritage Sites</Link>
              <Link to="/destinations?category=Hill+Station" style={styles.link}>Hill Stations</Link>
            </div>
          </div>

          {/* Explore States */}
          <div>
            <h4 style={styles.colTitle}>Explore States</h4>
            <div style={styles.linkList}>
              <Link to="/destinations?state=Kerala" style={styles.link}>Kerala</Link>
              <Link to="/destinations?state=Tamil+Nadu" style={styles.link}>Tamil Nadu</Link>
              <Link to="/destinations?state=Karnataka" style={styles.link}>Karnataka</Link>
              <Link to="/destinations?state=Goa" style={styles.link}>Goa</Link>
              <Link to="/destinations?state=Puducherry" style={styles.link}>Puducherry</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={styles.colTitle}>Contact Us</h4>
            <div style={styles.contactList}>
              <div style={styles.contactItem}>
                <FiMapPin size={16} />
                <span>Fort Kochi, Kerala, India</span>
              </div>
              <div style={styles.contactItem}>
                <FiMail size={16} />
                <span>hello@tourix.in</span>
              </div>
              <div style={styles.contactItem}>
                <FiPhone size={16} />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} Tourix. Made with 💚 in South India.
          </p>
          <div style={styles.bottomLinks}>
            <a href="#" style={styles.bottomLink}>Privacy Policy</a>
            <a href="#" style={styles.bottomLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#0d1117',
    borderTop: '1px solid var(--border)',
    paddingTop: '4rem',
    paddingBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '3rem',
    marginBottom: '3rem',
  },
  brandCol: { maxWidth: '300px' },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  brandDesc: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    lineHeight: 1.7,
    marginBottom: '1.5rem',
  },
  socialLinks: {
    display: 'flex',
    gap: '0.75rem',
  },
  socialIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s',
  },
  colTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    color: 'var(--text-primary)',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  link: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  bottom: {
    borderTop: '1px solid var(--border)',
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  bottomLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  bottomLink: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
};

export default Footer;
