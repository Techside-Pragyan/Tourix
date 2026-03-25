import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DestinationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [state, setState] = useState(searchParams.get('state') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Fetch categories and states on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, stateRes] = await Promise.all([
          destinationsAPI.getCategories(),
          destinationsAPI.getStates()
        ]);
        setCategories(catRes.data.data);
        setStates(stateRes.data.data);
      } catch (err) {
        console.error('Error loading filters:', err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch destinations when filters change
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        if (state !== 'All') params.state = state;
        if (sort) params.sort = sort;

        const { data } = await destinationsAPI.getAll(params);
        setDestinations(data.data);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Error loading destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();

    // Update URL params
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (state !== 'All') params.set('state', state);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [search, category, state, sort, page]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setState('All');
    setSort('');
    setPage(1);
  };

  const hasActiveFilters = search || category !== 'All' || state !== 'All' || sort;

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.title}>Explore Destinations</h1>
          <p style={styles.subtitle}>
            Discover {pagination.total} incredible places across South India
          </p>
        </div>
      </div>

      <div className="container">
        <div style={styles.layout}>
          {/* Filters Sidebar */}
          <aside style={{ ...styles.sidebar, ...(showFilters ? styles.sidebarOpen : {}) }}>
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}><FiFilter /> Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} style={styles.clearBtn}>
                  <FiX size={14} /> Clear All
                </button>
              )}
              <button
                className="btn btn-sm"
                style={styles.filterClose}
                onClick={() => setShowFilters(false)}
              >
                <FiX />
              </button>
            </div>

            {/* Search */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Search</label>
              <div style={styles.searchWrapper}>
                <FiSearch size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <div style={styles.chipGrid}>
                <button
                  style={{ ...styles.chip, ...(category === 'All' ? styles.chipActive : {}) }}
                  onClick={() => { setCategory('All'); setPage(1); }}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    style={{ ...styles.chip, ...(category === cat ? styles.chipActive : {}) }}
                    onClick={() => { setCategory(cat); setPage(1); }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* State Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>State</label>
              <div style={styles.chipGrid}>
                <button
                  style={{ ...styles.chip, ...(state === 'All' ? styles.chipActive : {}) }}
                  onClick={() => { setState('All'); setPage(1); }}
                >
                  All
                </button>
                {states.map((s) => (
                  <button
                    key={s}
                    style={{ ...styles.chip, ...(state === s ? styles.chipActive : {}) }}
                    onClick={() => { setState(s); setPage(1); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Sort By</label>
              <select
                className="form-select"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <main style={styles.main}>
            {/* Mobile filter toggle */}
            <button
              className="btn btn-outline"
              style={styles.filterToggle}
              onClick={() => setShowFilters(true)}
            >
              <FiFilter /> Filters {hasActiveFilters && `(Active)`}
            </button>

            {/* Results */}
            {loading ? (
              <div className="loader"><div className="spinner" /></div>
            ) : destinations.length === 0 ? (
              <div style={styles.empty}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <h3 style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>No destinations found</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Try adjusting your filters or search term
                </p>
                <button onClick={clearFilters} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div style={styles.resultsHeader}>
                  <span style={styles.resultCount}>
                    Showing {destinations.length} of {pagination.total} destinations
                  </span>
                </div>

                <div style={styles.grid}>
                  {destinations.map((dest, i) => (
                    <div key={dest._id} className="fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                      <DestinationCard destination={dest} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div style={styles.pagination}>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <FiChevronLeft /> Prev
                    </button>
                    <span style={styles.pageInfo}>
                      Page {page} of {pagination.pages}
                    </span>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page >= pagination.pages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
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
  header: {
    padding: '3rem 0 2rem',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    marginBottom: '2rem',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.25rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1.05rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '2rem',
    alignItems: 'start',
  },
  sidebar: {
    position: 'sticky',
    top: 'calc(var(--navbar-height) + 1rem)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
  },
  sidebarOpen: {},
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  sidebarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    background: 'none',
    color: 'var(--accent-light)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    border: 'none',
  },
  filterClose: {
    display: 'none',
  },
  filterGroup: {
    marginBottom: '1.5rem',
  },
  filterLabel: {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  searchWrapper: {
    position: 'relative',
  },
  chipGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  chip: {
    padding: '0.4rem 0.9rem',
    borderRadius: '9999px',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  },
  chipActive: {
    background: 'rgba(26, 107, 60, 0.2)',
    borderColor: 'var(--primary)',
    color: 'var(--primary-light)',
  },
  main: {
    minHeight: '400px',
  },
  filterToggle: {
    display: 'none',
    marginBottom: '1rem',
  },
  resultsHeader: {
    marginBottom: '1.25rem',
  },
  resultCount: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: '1.5rem',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2.5rem',
  },
  pageInfo: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
};

// Add responsive styles via media query workaround
const mediaStyles = document.createElement('style');
mediaStyles.textContent = `
  @media (max-width: 768px) {
    .destinations-layout { grid-template-columns: 1fr !important; }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('dest-responsive')) {
  mediaStyles.id = 'dest-responsive';
  document.head.appendChild(mediaStyles);
}

export default DestinationsPage;
