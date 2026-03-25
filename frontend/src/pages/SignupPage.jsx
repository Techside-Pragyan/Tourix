import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Tourix 🌴');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={{ fontSize: '2.5rem' }}>🌴</span>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join Tourix and start exploring South India</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={styles.inputWrapper}>
              <FiUser size={18} style={styles.inputIcon} />
              <input
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <FiMail size={18} style={styles.inputIcon} />
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={styles.inputWrapper}>
              <FiLock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={styles.inputWrapper}>
              <FiLock size={18} style={styles.inputIcon} />
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gold btn-block btn-lg"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, #0a0e17, #0d2818)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '2.5rem',
    boxShadow: 'var(--shadow-xl)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginTop: '0.75rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  error: {
    background: 'rgba(184, 51, 51, 0.15)',
    border: '1px solid rgba(184, 51, 51, 0.3)',
    color: 'var(--accent-light)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '0.85rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.85rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    marginTop: '1.75rem',
    fontSize: '0.9rem',
  },
  link: {
    color: 'var(--secondary-light)',
    fontWeight: 600,
  },
};

export default SignupPage;
