import axios from 'axios';

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

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};

export const companyAPI = {
  registerCompany: (formData) => api.post('/companies/signup', formData),
  getPendingCompanies: () => api.get('/companies/pending'),
  verifyCompany: (id) => api.patch(`/companies/verify/${id}`),
    getCompanyProfile: () => api.get('/companies/me'),
  updateCompanyProfile: (formData) => api.put('/companies/me', formData),
};

export const commentAPI = {
  create: (data, config = {}) => api.post('/comments', data, config),
  getAll: () => api.get('/comments'),
  getById: (id) => api.get(`/comments/${id}`),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  getByEvent: (eventId) => api.get(`/comments/event/${eventId}`),
  getByUser: (userId) => api.get(`/comments/user/${userId}`),
};

export const eventAPI = {
  create: (data) => api.post('/events', data),
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getByUser: (userId) => api.get(`/events/user/${userId}`),
  register: (eventId) => api.post(`/events/${eventId}/register`),
  unregister: (eventId) => api.post(`/events/${eventId}/unregister`),
};

export const eventCategoryAPI = {
  getAllCategories: () => api.get('/event-categories/categories'),
  getEventsByCategory: (categoryId) => api.get(`/event-categories/events?category=${categoryId}`),
  getAllEvents: () => api.get('/event-categories/events'),
  addCategoryToEvent: (eventId, categoryId) => api.post(`/events/${eventId}/categories`, { categoryId }),
  removeCategoryFromEvent: (eventId, categoryId) => api.delete(`/events/${eventId}/categories/${categoryId}`),
  createCategory: (name) => api.post('/event-categories/categories', { name }),
  updateCategory: (id, name) => api.put(`/event-categories/categories/${id}`, { name }),
  deleteCategory: (id) => api.delete(`/event-categories/categories/${id}`),
};

export const companyEventAPI = {
  getMyEvents: () => api.get('/company-events/my-events'),
  createEvent: (data) => api.post('/company-events', data),
  updateEvent: (id, data) => api.put(`/company-events/${id}`, data),
  deleteEvent: (id) => api.delete(`/company-events/${id}`)
};

export default api;