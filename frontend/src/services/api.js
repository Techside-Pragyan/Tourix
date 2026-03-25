import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('tourix_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ========== Auth API ==========
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/me', data)
};

// ========== Destinations API ==========
export const destinationsAPI = {
  getAll: (params) => API.get('/destinations', { params }),
  getById: (id) => API.get(`/destinations/${id}`),
  getCategories: () => API.get('/destinations/categories'),
  getStates: () => API.get('/destinations/states')
};

// ========== Bookings API ==========
export const bookingsAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my'),
  getById: (id) => API.get(`/bookings/${id}`),
  cancel: (id) => API.put(`/bookings/${id}/cancel`)
};

// ========== Reviews API ==========
export const reviewsAPI = {
  getByDestination: (destinationId) => API.get(`/reviews/${destinationId}`),
  create: (destinationId, data) => API.post(`/reviews/${destinationId}`, data),
  delete: (id) => API.delete(`/reviews/${id}`)
};

export default API;
