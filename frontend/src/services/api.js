import axios from 'axios';
import localDestinations from '../data/destinations';

// Base API configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // 5 second timeout
});

// Add auth token to requests automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('tourix_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ============================================================
// LOCAL DATA HELPERS (fallback when backend is not available)
// ============================================================

// Check if backend is available
let backendAvailable = null;
const checkBackend = async () => {
  if (backendAvailable !== null) return backendAvailable;
  try {
    await axios.get('http://localhost:5000/api/health', { timeout: 2000 });
    backendAvailable = true;
  } catch {
    backendAvailable = false;
    console.warn('⚠️ Backend not available — using local destination data');
  }
  // Re-check every 30 seconds
  setTimeout(() => { backendAvailable = null; }, 30000);
  return backendAvailable;
};

// Local filtering/searching helper
const filterLocalDestinations = (params = {}) => {
  let filtered = [...localDestinations];
  const { search, category, state, featured, sort, page = 1, limit = 12 } = params;

  // Search
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category && category !== 'All') {
    filtered = filtered.filter(d => d.category === category);
  }

  // State filter
  if (state && state !== 'All') {
    filtered = filtered.filter(d => d.state === state);
  }

  // Featured filter
  if (featured === 'true' || featured === true) {
    filtered = filtered.filter(d => d.featured);
  }

  // Sort
  switch (sort) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.reverse();
      break;
    default:
      // Featured first, then by rating
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
  }

  // Pagination
  const total = filtered.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum);

  return {
    data: {
      success: true,
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  };
};

// ========== Auth API ==========
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/me', data)
};

// ========== Destinations API (with local fallback) ==========
export const destinationsAPI = {
  getAll: async (params) => {
    const isUp = await checkBackend();
    if (isUp) {
      return API.get('/destinations', { params });
    }
    return filterLocalDestinations(params);
  },

  getById: async (id) => {
    const isUp = await checkBackend();
    if (isUp) {
      return API.get(`/destinations/${id}`);
    }
    const dest = localDestinations.find(d => d._id === id);
    if (!dest) throw new Error('Destination not found');
    return { data: { success: true, data: dest } };
  },

  getCategories: async () => {
    const isUp = await checkBackend();
    if (isUp) {
      return API.get('/destinations/categories');
    }
    const cats = [...new Set(localDestinations.map(d => d.category))];
    return { data: { success: true, data: cats } };
  },

  getStates: async () => {
    const isUp = await checkBackend();
    if (isUp) {
      return API.get('/destinations/states');
    }
    const states = [...new Set(localDestinations.map(d => d.state))];
    return { data: { success: true, data: states } };
  }
};

// ========== Bookings API ==========
export const bookingsAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my'),
  getById: (id) => API.get(`/bookings/${id}`),
  cancel: (id) => API.put(`/bookings/${id}/cancel`)
};

// ========== Reviews API (with local fallback) ==========
// Store reviews in localStorage when backend is down
const getLocalReviews = (destId) => {
  const all = JSON.parse(localStorage.getItem('tourix_reviews') || '{}');
  return all[destId] || [];
};

const saveLocalReview = (destId, review) => {
  const all = JSON.parse(localStorage.getItem('tourix_reviews') || '{}');
  if (!all[destId]) all[destId] = [];
  all[destId].unshift(review);
  localStorage.setItem('tourix_reviews', JSON.stringify(all));
};

export const reviewsAPI = {
  getByDestination: async (destinationId) => {
    const isUp = await checkBackend();
    if (isUp) {
      return API.get(`/reviews/${destinationId}`);
    }
    const reviews = getLocalReviews(destinationId);
    return { data: { success: true, data: reviews, count: reviews.length } };
  },

  create: async (destinationId, data) => {
    const isUp = await checkBackend();
    if (isUp) {
      return API.post(`/reviews/${destinationId}`, data);
    }
    // Save locally
    const user = JSON.parse(localStorage.getItem('tourix_user') || 'null');
    const review = {
      _id: 'local_' + Date.now(),
      user: { _id: user?._id || 'local', name: user?.name || 'You' },
      destination: destinationId,
      rating: Number(data.rating),
      title: data.title,
      comment: data.comment,
      createdAt: new Date().toISOString()
    };
    saveLocalReview(destinationId, review);
    return { data: { success: true, data: review } };
  },

  delete: async (id) => {
    const isUp = await checkBackend();
    if (isUp) {
      return API.delete(`/reviews/${id}`);
    }
    // Remove from localStorage
    const all = JSON.parse(localStorage.getItem('tourix_reviews') || '{}');
    for (const destId in all) {
      all[destId] = all[destId].filter(r => r._id !== id);
    }
    localStorage.setItem('tourix_reviews', JSON.stringify(all));
    return { data: { success: true, message: 'Review deleted' } };
  }
};

export default API;
