const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  getMe: () => api.get('/auth/me'),
};

const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};

const commentAPI = {
  create: (data) => api.post('/comments', data),
  getAll: () => api.get('/comments'),
  getById: (id) => api.get(`/comments/${id}`),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  getByEvent: (eventId) => api.get(`/comments/event/${eventId}`),
  getByUser: (userId) => api.get(`/comments/user/${userId}`),
};

const eventAPI = {
  create: (data) => api.post('/events', data),
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getByUser: (userId) => api.get(`/events/user/${userId}`),
  register: (eventId) => api.post(`/events/${eventId}/register`),
  unregister: (eventId) => api.post(`/events/${eventId}/unregister`),
};

module.exports = {
  api,
  authAPI,
  userAPI,
  commentAPI,
  eventAPI
};